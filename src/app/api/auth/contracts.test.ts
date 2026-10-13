import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/session", () => ({ createSessionToken: vi.fn() }));
vi.mock("@/lib/crm/agentSync", () => ({ syncAgentToCrm: vi.fn() }));
vi.mock("@/lib/sanity/users/getAuthUser", () => ({ getAuthUser: vi.fn() }));
vi.mock("@/lib/sanity/users/repository", () => ({
  getAgencyByLogin: vi.fn(),
  getAgentByEmail: vi.fn(),
  identityExists: vi.fn(),
  createAgentUser: vi.fn(),
  updateAgencyUser: vi.fn(),
  updateAgentUser: vi.fn(),
}));
import { POST as login } from "@/app/api/auth/login/route";
import { POST as signup } from "@/app/api/auth/sign-up/route";
import { POST as password } from "@/app/api/auth/change-password/route";
import { PATCH as agent } from "@/app/api/agent/profile/route";
import { PATCH as agency } from "@/app/api/agency/profile/route";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import {
  getAgentByEmail,
  getAgencyByLogin,
  identityExists,
  updateAgentUser,
  updateAgencyUser,
  createAgentUser,
} from "@/lib/sanity/users/repository";
import { syncAgentToCrm } from "@/lib/crm/agentSync";
import { createSessionToken } from "@/lib/auth/session";
import bcrypt from "bcryptjs";
const request = (body: string) => new Request("http://localhost/api", { method: "POST", body });
async function check(response: Response, status: number, error: string) {
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual({ error });
}
beforeEach(() => vi.resetAllMocks());
const agentValues = {
  email: "agent@example.com",
  companyName: "Company",
  legalCompanyName: "Legal",
  phone: "+38 (067) 123-45-67",
  edrpou: "12345678",
  city: "Kyiv",
  taxForm: "fop" as const,
};
const agencyValues = {
  legalAgencyName: "Agency",
  login: "agency",
  agencyEmail: "agency@example.com",
  agencyPhone: agentValues.phone,
  mainOfficeEmail: "office@example.com",
};
it("keeps the registration contract when optional CRM agency identity is null", async () => {
  vi.mocked(identityExists).mockResolvedValue(true);
  await check(
    await signup(
      request(JSON.stringify({ ...agentValues, password: "fixture password", agencyCrmId: null })),
    ),
    409,
    "USER_ALREADY_EXISTS",
  );
  expect(createAgentUser).not.toHaveBeenCalled();
  expect(syncAgentToCrm).not.toHaveBeenCalled();
});
it.each(["synced", "failed"] as const)(
  "keeps registration status and persistence order when CRM is %s",
  async (status) => {
    vi.mocked(identityExists).mockResolvedValue(false);
    vi.mocked(createAgentUser).mockResolvedValue({
      _id: "agent.fixture",
      _type: "agentUser",
      _rev: "1",
      _createdAt: "2026-01-01",
      _updatedAt: "2026-01-01",
      identityLookup: "fixture",
      ...agentValues,
      site: undefined,
      displayName: "Company",
      displayIdentity: "agent@example.com",
      encryptedPayload: {
        _type: "encryptedUserPayload",
        version: 1,
        iv: "fixture",
        ciphertext: "fixture",
        tag: "fixture",
      },
      isApproved: false,
      agency: undefined,
      crmLinked: false,
      crmSync: { status: "pending" },
    });
    vi.mocked(syncAgentToCrm).mockResolvedValue(
      status === "synced" ? { status, crmId: "fixture" } : { status, reason: "fixture" },
    );
    const response = await signup(
      request(
        JSON.stringify({
          ...agentValues,
          password: "fixture password",
          site: null,
          agencyCrmId: null,
        }),
      ),
    );
    expect(response.status).toBe(status === "synced" ? 201 : 202);
    expect(await response.json()).toEqual({ success: true, crmSync: status });
    const [documentId, payload, publicFields] = vi.mocked(createAgentUser).mock.calls[0];
    expect(documentId).toMatch(/^agent\./);
    expect(payload).toMatchObject({ ...agentValues, site: undefined, agencyCrmId: undefined });
    expect(await bcrypt.compare("fixture password", payload.password.hash)).toBe(true);
    expect(publicFields).toMatchObject({
      isApproved: false,
      crmSync: { status: "pending", attempts: 0 },
    });
    expect(syncAgentToCrm).toHaveBeenCalledWith("agent.fixture");
    expect(vi.mocked(createAgentUser).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(syncAgentToCrm).mock.invocationCallOrder[0],
    );
  },
);
it("preserves successful login roles and session cookies", async () => {
  const storedPassword = { plain: "test password", hash: await bcrypt.hash("test password", 10) };
  vi.mocked(createSessionToken).mockResolvedValue("test-session");
  vi.mocked(getAgentByEmail).mockResolvedValue({
    ...agentValues,
    _id: "agent.test",
    _rev: "1",
    isApproved: true,
    password: storedPassword,
  });
  const agentResponse = await login(
    request(JSON.stringify({ email: " AGENT@example.com ", password: storedPassword.plain })),
  );
  expect(await agentResponse.json()).toEqual({ role: "agent" });
  expect(getAgentByEmail).toHaveBeenCalledWith("agent@example.com");
  expect(agentResponse.cookies.get("auth_token")?.value).toBe("test-session");
  expect(agentResponse.headers.get("set-cookie")).toContain("HttpOnly");
  expect(agentResponse.headers.get("set-cookie")).toContain("SameSite=lax");
  expect(agentResponse.headers.get("set-cookie")).not.toContain("Max-Age");
  vi.mocked(getAgentByEmail).mockResolvedValue(null);
  vi.mocked(getAgencyByLogin).mockResolvedValue({
    ...agencyValues,
    _id: "agency.test",
    _rev: "1",
    password: storedPassword,
  });
  const agencyResponse = await login(
    request(JSON.stringify({ email: " AGENCY ", password: storedPassword.plain })),
  );
  expect(await agencyResponse.json()).toEqual({ role: "agency" });
  expect(agencyResponse.headers.get("set-cookie")).not.toContain("Max-Age");
  expect(createSessionToken).toHaveBeenLastCalledWith({
    sub: "agency.test",
    role: "agency",
    login: "agency",
  });
});
it.each(["agent", "agency"] as const)(
  "keeps %s signed in for seven days when remembered",
  async (role) => {
    const password = "test password";
    const storedPassword = { plain: password, hash: await bcrypt.hash(password, 10) };
    vi.mocked(createSessionToken).mockResolvedValue("test-session");
    if (role === "agent") {
      vi.mocked(getAgentByEmail).mockResolvedValue({
        ...agentValues,
        _id: "agent.test",
        _rev: "1",
        isApproved: true,
        password: storedPassword,
      });
    } else {
      vi.mocked(getAgentByEmail).mockResolvedValue(null);
      vi.mocked(getAgencyByLogin).mockResolvedValue({
        ...agencyValues,
        _id: "agency.test",
        _rev: "1",
        password: storedPassword,
      });
    }
    const response = await login(
      request(
        JSON.stringify({
          email: role === "agent" ? "agent@example.com" : "agency",
          password,
          rememberMe: true,
        }),
      ),
    );
    expect(await response.json()).toEqual({ role });
    expect(response.headers.get("set-cookie")).toContain("Max-Age=604800");
  },
);
it("preserves duplicate identity errors without writing profiles", async () => {
  vi.mocked(identityExists).mockResolvedValue(true);
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "agent.test", role: "agent" });
  await check(await agent(request(JSON.stringify(agentValues))), 409, "EMAIL_ALREADY_EXISTS");
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "agency.test", role: "agency" });
  await check(await agency(request(JSON.stringify(agencyValues))), 409, "LOGIN_ALREADY_EXISTS");
  expect(updateAgentUser).not.toHaveBeenCalled();
  expect(updateAgencyUser).not.toHaveBeenCalled();
});
it("persists optional nulls and normalized profile values through the existing callbacks", async () => {
  const originalPassword = { plain: "fixture", hash: "fixture-hash" };
  vi.mocked(identityExists).mockResolvedValue(false);
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "agent.test", role: "agent" });
  vi.mocked(updateAgentUser).mockImplementation(async (_id, update) =>
    update({ ...agentValues, password: originalPassword }),
  );
  const agentResponse = await agent(
    request(
      JSON.stringify({ ...agentValues, email: "AGENT@example.com", edrpou: 12345678, site: null }),
    ),
  );
  expect(await agentResponse.json()).toEqual({ success: true });
  const agentUpdate = vi
    .mocked(updateAgentUser)
    .mock.calls[0][1]({ ...agentValues, password: originalPassword });
  expect(agentUpdate).toMatchObject({
    email: "agent@example.com",
    edrpou: "12345678",
    site: null,
    password: originalPassword,
  });
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "agency.test", role: "agency" });
  vi.mocked(updateAgencyUser).mockImplementation(async (_id, update) =>
    update({ ...agencyValues, password: originalPassword }),
  );
  const agencyResponse = await agency(
    request(
      JSON.stringify({ ...agencyValues, login: "AGENCY", agencyEdrpou: null, agencyCity: null }),
    ),
  );
  expect(await agencyResponse.json()).toEqual({ success: true });
  expect(
    vi.mocked(updateAgencyUser).mock.calls[0][1]({ ...agencyValues, password: originalPassword }),
  ).toMatchObject({
    login: "agency",
    agencyEdrpou: null,
    agencyCity: null,
    password: originalPassword,
  });
});
it("preserves invalid JSON and missing login fields", async () => {
  await check(await login(request("{")), 400, "INVALID_BODY");
  await check(await login(request("{}")), 400, "MISSING_FIELDS");
  await check(
    await login(
      request(
        JSON.stringify({ email: "agent@example.com", password: "secret", rememberMe: "true" }),
      ),
    ),
    400,
    "MISSING_FIELDS",
  );
});
it("preserves registration validation failures", async () => {
  await check(await signup(request("{")), 400, "INVALID_BODY");
  await check(await signup(request("{}")), 400, "VALIDATION_FAILED");
});
it("preserves authentication and role guards before parsing", async () => {
  vi.mocked(getAuthUser).mockResolvedValue(null);
  await check(await password(request("{}")), 401, "UNAUTHORIZED");
  await check(await agent(request("{}")), 401, "UNAUTHORIZED");
  await check(await agency(request("{}")), 401, "UNAUTHORIZED");
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "test", role: "agency" });
  await check(await agent(request("{}")), 403, "FORBIDDEN");
});
it("preserves password and profile error contracts", async () => {
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "test", role: "agent" });
  await check(await password(request("{}")), 400, "MISSING_PASSWORD");
  await check(await password(request("{")), 400, "INVALID_BODY");
  await check(await agent(request("{}")), 400, "VALIDATION_FAILED");
  await check(await agent(request("{")), 500, "UPDATE_FAILED");
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "test", role: "agency" });
  await check(await agency(request("{}")), 400, "VALIDATION_FAILED");
  await check(await agency(request("{")), 500, "UPDATE_FAILED");
});
