import "server-only";

import usersClient from "@/lib/sanity/usersClient";
import {
    decryptUserPayload,
    encryptUserPayload,
    getUserIdentityLookup,
    normalizeUserIdentity,
    type EncryptedUserPayload,
} from "./crypto";

export type PasswordValue = {
    plain: string;
    hash: string;
};

export type AgentUserPayload = {
    email: string;
    companyName: string;
    legalCompanyName: string;
    phone: string;
    edrpou: string;
    city: string;
    site?: string | null;
    taxForm: "fop" | "tov" | "other";
    agencyCrmId?: string | null;
    crmId?: string | number | null;
    crmLastErrorMessage?: string | null;
    password: PasswordValue;
    passwordResetRequired?: boolean;
};

export type AgencyUserPayload = {
    legalAgencyName: string;
    marketingAgencyName?: string | null;
    login: string;
    agencyEdrpou?: string | null;
    agencyCity?: string | null;
    agencyLegalAddress?: string | null;
    agencyEmail: string;
    agencyPhone: string;
    mainOfficeEmail: string;
    password: PasswordValue;
    passwordResetRequired?: boolean;
};

export type CrmSyncStatus =
    | "pending"
    | "processing"
    | "synced"
    | "failed"
    | "manualReview";

export type CrmSyncValue = {
    status?: CrmSyncStatus;
    attempts?: number;
    nextRetryAt?: string;
    lastAttemptAt?: string;
    lastSuccessAt?: string;
    lastErrorCode?: string;
    lockUntil?: string;
    manualRetryRequestedAt?: string;
};

type SanityReference = {_type: "reference"; _ref: string; _key?: string};

type EncryptedAgentDocument = {
    _id: string;
    _rev: string;
    _type: "agentUser";
    encryptedPayload: EncryptedUserPayload;
    isApproved?: boolean;
    agency?: SanityReference[];
    crmLinked?: boolean;
    crmSync?: CrmSyncValue;
};

type EncryptedAgencyDocument = {
    _id: string;
    _rev: string;
    _type: "agencyUser";
    encryptedPayload: EncryptedUserPayload;
};

export type AgentUser = AgentUserPayload &
    Pick<EncryptedAgentDocument, "_id" | "_rev" | "isApproved" | "agency" | "crmSync">;

export type AgencyUser = AgencyUserPayload & Pick<EncryptedAgencyDocument, "_id" | "_rev">;

function decryptAgent(document: EncryptedAgentDocument): AgentUser {
    return {
        ...decryptUserPayload<AgentUserPayload>(
            document._id,
            "agentUser",
            document.encryptedPayload
        ),
        _id: document._id,
        _rev: document._rev,
        isApproved: document.isApproved,
        agency: document.agency,
        crmSync: document.crmSync,
    };
}

function decryptAgency(document: EncryptedAgencyDocument): AgencyUser {
    return {
        ...decryptUserPayload<AgencyUserPayload>(
            document._id,
            "agencyUser",
            document.encryptedPayload
        ),
        _id: document._id,
        _rev: document._rev,
    };
}

export async function getAgentByEmail(email: string) {
    const document = await usersClient.fetch<EncryptedAgentDocument | null>(
        `*[_type == "agentUser" && identityLookup == $identityLookup][0]{
            _id, _rev, _type, encryptedPayload, isApproved, agency, crmSync
        }`,
        {identityLookup: getUserIdentityLookup(email)}
    );

    return document ? decryptAgent(document) : null;
}

export async function getAgencyByLogin(login: string) {
    const document = await usersClient.fetch<EncryptedAgencyDocument | null>(
        `*[_type == "agencyUser" && identityLookup == $identityLookup][0]{
            _id, _rev, _type, encryptedPayload
        }`,
        {identityLookup: getUserIdentityLookup(login)}
    );

    return document ? decryptAgency(document) : null;
}

export async function getAgentById(id: string) {
    const document = await usersClient.fetch<EncryptedAgentDocument | null>(
        `*[_type == "agentUser" && _id == $id][0]{
            _id, _rev, _type, encryptedPayload, isApproved, agency, crmSync
        }`,
        {id}
    );

    return document ? decryptAgent(document) : null;
}

export async function getAgencyById(id: string) {
    const document = await usersClient.fetch<EncryptedAgencyDocument | null>(
        `*[_type == "agencyUser" && _id == $id][0]{
            _id, _rev, _type, encryptedPayload
        }`,
        {id}
    );

    return document ? decryptAgency(document) : null;
}

export async function identityExists(
    type: "agentUser" | "agencyUser",
    identity: string,
    excludingId?: string
) {
    return Boolean(
        await usersClient.fetch<string | null>(
            `*[
                _type == $type &&
                identityLookup == $identityLookup &&
                (!defined($excludingId) || _id != $excludingId)
            ][0]._id`,
            {
                type,
                identityLookup: getUserIdentityLookup(identity),
                excludingId: excludingId ?? null,
            }
        )
    );
}

export async function createAgentUser(
    id: string,
    payload: AgentUserPayload,
    publicFields?: Pick<EncryptedAgentDocument, "isApproved" | "agency" | "crmSync">
) {
    const normalizedPayload = {
        ...payload,
        email: normalizeUserIdentity(payload.email),
    };

    return usersClient.create({
        _id: id,
        _type: "agentUser",
        identityLookup: getUserIdentityLookup(normalizedPayload.email),
        encryptedPayload: encryptUserPayload(id, "agentUser", normalizedPayload),
        isApproved: publicFields?.isApproved ?? false,
        agency: publicFields?.agency,
        crmLinked: Boolean(normalizedPayload.crmId),
        crmSync: publicFields?.crmSync,
    });
}

async function updatePayload<T extends object>(
    id: string,
    type: "agentUser" | "agencyUser",
    identity: string,
    revision: string,
    payload: T,
    extraFields?: Record<string, unknown>
) {
    return usersClient
        .patch(id)
        .ifRevisionId(revision)
        .set({
            identityLookup: getUserIdentityLookup(identity),
            encryptedPayload: encryptUserPayload(id, type, payload),
            ...extraFields,
        })
        .commit();
}

export async function updateAgentUser(
    id: string,
    update: (current: AgentUserPayload) => AgentUserPayload
) {
    const current = await getAgentById(id);
    if (!current) return null;

    const {
        _id: _ignoredId,
        _rev,
        isApproved: _ignoredApproval,
        agency: _ignoredAgency,
        crmSync: _ignoredSync,
        ...currentPayload
    } = current;
    const next = update(currentPayload);
    const normalized = {...next, email: normalizeUserIdentity(next.email)};

    await updatePayload(id, "agentUser", normalized.email, _rev, normalized, {
        crmLinked: Boolean(normalized.crmId),
    });
    return normalized;
}

export async function updateAgencyUser(
    id: string,
    update: (current: AgencyUserPayload) => AgencyUserPayload
) {
    const current = await getAgencyById(id);
    if (!current) return null;

    const {_id: _ignoredId, _rev, ...currentPayload} = current;
    const next = update(currentPayload);
    const normalized = {...next, login: normalizeUserIdentity(next.login)};

    await updatePayload(id, "agencyUser", normalized.login, _rev, normalized);
    return normalized;
}

export async function getAgentsByAgency(agencyId: string) {
    const documents = await usersClient.fetch<EncryptedAgentDocument[]>(
        `*[_type == "agentUser" && references($agencyId)]{
            _id, _rev, _type, encryptedPayload, isApproved, agency, crmSync
        }`,
        {agencyId}
    );

    return documents.map(decryptAgent);
}
