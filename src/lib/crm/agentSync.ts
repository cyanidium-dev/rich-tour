import "server-only";

import { isAxiosError } from "axios";

import { sanityUsersClient as usersClient } from "@/shared/api/users-server";
import { getAgentById, updateAgentUser } from "@/lib/sanity/users/repository";
import { CrmIdentityConflictError, findAgentCrmId } from "@/lib/crm/users/findAgentCrmIdByEmail";
import { sendAgentToCrm } from "@/lib/crm/users/sendAgentToCrm";

export type CrmSyncStatus = "pending" | "processing" | "synced" | "failed" | "manualReview";

export type AgentSyncResult =
  | { status: "synced"; crmId: string }
  | { status: "skipped"; reason: string }
  | { status: "failed" | "manualReview"; reason: string };

const MAX_ATTEMPTS = 6;
const LOCK_MS = 5 * 60 * 1000;
const RETRY_DAYS = [1, 2, 4, 7, 7] as const;

function getErrorDetails(error: unknown) {
  if (error instanceof CrmIdentityConflictError) {
    return {
      code: "CRM_IDENTITY_CONFLICT",
      message: "Multiple CRM contacts match this agent",
      isPermanent: true,
    };
  }

  if (isAxiosError(error)) {
    const status = error.response?.status;
    return {
      code: status ? `CRM_HTTP_${status}` : "CRM_NETWORK_ERROR",
      message: status
        ? `CRM request failed with status ${status}`
        : "CRM request failed because of a network error",
      isPermanent: status !== undefined && [400, 401, 403, 404, 422].includes(status),
    };
  }

  return {
    code: "CRM_SYNC_ERROR",
    message: "CRM synchronization failed",
    isPermanent: false,
  };
}

function getNextRetryAt(attempts: number) {
  const delayDays = RETRY_DAYS[Math.min(attempts - 1, RETRY_DAYS.length - 1)];
  return new Date(Date.now() + delayDays * 86_400_000).toISOString();
}

async function getAgent(agentId: string) {
  return getAgentById(agentId);
}

export async function syncAgentToCrm(agentId: string): Promise<AgentSyncResult> {
  const agent = await getAgent(agentId);

  if (!agent) return { status: "skipped", reason: "AGENT_NOT_FOUND" };
  if (agent.crmId) return { status: "skipped", reason: "ALREADY_SYNCED" };

  const lockUntil = agent.crmSync?.lockUntil ? new Date(agent.crmSync.lockUntil).getTime() : 0;
  if (agent.crmSync?.status === "processing" && lockUntil > Date.now()) {
    return { status: "skipped", reason: "SYNC_IN_PROGRESS" };
  }

  if (!agent.email || !agent.phone || !agent.companyName) {
    await usersClient
      .patch(agent._id)
      .ifRevisionId(agent._rev)
      .set({
        crmSync: {
          status: "manualReview",
          attempts: agent.crmSync?.attempts ?? 0,
          lastAttemptAt: new Date().toISOString(),
          lastErrorCode: "MISSING_REQUIRED_FIELDS",
        },
      })
      .commit();
    await updateAgentUser(agent._id, (current) => ({
      ...current,
      crmLastErrorMessage: "Required CRM synchronization fields are missing",
    }));
    return { status: "manualReview", reason: "MISSING_REQUIRED_FIELDS" };
  }

  const attempts = (agent.crmSync?.attempts ?? 0) + 1;
  const startedAt = new Date().toISOString();

  try {
    await usersClient
      .patch(agent._id)
      .ifRevisionId(agent._rev)
      .set({
        crmSync: {
          ...agent.crmSync,
          status: "processing",
          attempts,
          lastAttemptAt: startedAt,
          lockUntil: new Date(Date.now() + LOCK_MS).toISOString(),
        },
      })
      .commit();
  } catch {
    return { status: "skipped", reason: "CONCURRENT_SYNC" };
  }

  try {
    const existingCrmId = await findAgentCrmId({
      externalId: agent._id,
      email: agent.email,
      phone: agent.phone,
    });
    const crmId =
      existingCrmId ??
      (await sendAgentToCrm({
        externalId: agent._id,
        fullName: agent.companyName,
        agencyCrmId: agent.agencyCrmId ? Number(agent.agencyCrmId) : undefined,
        phone: agent.phone,
        email: agent.email,
        website: agent.site ?? undefined,
        license: agent.edrpou,
        city: agent.city,
        taxForm: agent.taxForm,
        legalCompanyName: agent.legalCompanyName,
      }));

    const updated = await updateAgentUser(agent._id, (current) => ({
      ...current,
      crmId,
      crmLastErrorMessage: null,
    }));
    if (!updated) {
      return { status: "skipped", reason: "AGENT_NOT_FOUND" };
    }

    await usersClient
      .patch(agent._id)
      .set({
        crmSync: {
          status: "synced",
          attempts,
          lastAttemptAt: startedAt,
          lastSuccessAt: new Date().toISOString(),
        },
      })
      .commit();

    return { status: "synced", crmId };
  } catch (error) {
    const details = getErrorDetails(error);
    const shouldStop = details.isPermanent || attempts >= MAX_ATTEMPTS;
    const status = shouldStop ? "manualReview" : "failed";

    await updateAgentUser(agent._id, (current) => ({
      ...current,
      crmLastErrorMessage: details.message,
    }));

    await usersClient
      .patch(agent._id)
      .set({
        crmSync: {
          status,
          attempts,
          lastAttemptAt: startedAt,
          lastErrorCode: details.code,
          ...(shouldStop ? {} : { nextRetryAt: getNextRetryAt(attempts) }),
        },
      })
      .commit();

    return { status, reason: details.code };
  }
}

export async function findAgentsReadyForSync(limit = 20) {
  return usersClient.fetch<Array<{ _id: string }>>(
    `*[
            _type == "agentUser" &&
            crmLinked != true &&
            coalesce(crmSync.attempts, 0) < $maxAttempts &&
            (
                !defined(crmSync.status) ||
                crmSync.status == "pending" ||
                (crmSync.status == "failed" && crmSync.nextRetryAt <= now()) ||
                (crmSync.status == "processing" && crmSync.lockUntil <= now())
            )
        ] | order(coalesce(crmSync.nextRetryAt, _createdAt) asc)[0...$limit]{ _id }`,
    { limit, maxAttempts: MAX_ATTEMPTS },
  );
}
