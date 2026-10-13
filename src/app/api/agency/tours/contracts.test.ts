import { beforeEach, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/sanity/users/getAuthUser", () => ({ getAuthUser: vi.fn() }));
vi.mock("@/entities/user/server", () => ({ getAgentsByAgency: vi.fn() }));
vi.mock("@/entities/order/api/getCrmOrdersByClientId", () => ({ getCrmOrdersByClientId: vi.fn() }));

import { GET } from "./route";
import { GET as agentGET } from "@/app/api/agent/tours/route";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import { getAgentsByAgency } from "@/entities/user/server";
import { getCrmOrdersByClientId } from "@/entities/order/server";

beforeEach(() => vi.resetAllMocks());

const agentFixture = (
  values: Partial<Awaited<ReturnType<typeof getAgentsByAgency>>[number]> & { _id: string },
) => ({
  _rev: "1",
  email: "",
  companyName: "",
  legalCompanyName: "",
  phone: "",
  edrpou: "",
  city: "",
  taxForm: "fop" as const,
  password: { plain: "fixture", hash: "fixture" },
  ...values,
});

it("keeps unauthorized responses for both order routes without touching CRM", async () => {
  vi.mocked(getAuthUser).mockResolvedValue(null);
  for (const get of [GET, agentGET]) {
    const response = await get();
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "UNAUTHORIZED" });
  }
  expect(getAgentsByAgency).not.toHaveBeenCalled();
  expect(getCrmOrdersByClientId).not.toHaveBeenCalled();
});

it("keeps agent CRM ID errors and rejects the opposite role", async () => {
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "agent", role: "agent" });
  const missing = await agentGET();
  expect(missing.status).toBe(409);
  expect(await missing.json()).toEqual({ error: "CRM_ID_MISSING" });
  expect((await GET()).status).toBe(401);
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "agency", role: "agency" });
  expect((await agentGET()).status).toBe(401);
  expect(getCrmOrdersByClientId).not.toHaveBeenCalled();
});

it("keeps agency ordering, label fallbacks, skipped agents and order ownership", async () => {
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "agency", role: "agency" });
  vi.mocked(getAgentsByAgency).mockResolvedValue([
    agentFixture({ _id: "b", companyName: "Beta", crmId: "20" }),
    agentFixture({ _id: "a", legalCompanyName: "Alpha", crmId: 10 }),
    agentFixture({ _id: "c", email: "Charlie", crmId: null }),
    agentFixture({ _id: "d", crmId: 0 }),
  ]);
  vi.mocked(getCrmOrdersByClientId).mockImplementation(async (crmId) => [
    { id: String(crmId), extra: "retained" },
  ]);
  const response = await GET();
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    agents: [
      { id: "a", name: "Alpha", crmId: 10 },
      { id: "b", name: "Beta", crmId: "20" },
      { id: "c", name: "Charlie", crmId: null },
      { id: "d", name: "Агент без назви", crmId: 0 },
    ].sort((a, b) => a.name.localeCompare(b.name)),
    skippedAgents: [
      { id: "c", name: "Charlie" },
      { id: "d", name: "Агент без назви" },
    ].sort((a, b) => a.name.localeCompare(b.name)),
    orders: [
      { id: "10", extra: "retained", agent: { id: "a", name: "Alpha", crmId: 10 } },
      { id: "20", extra: "retained", agent: { id: "b", name: "Beta", crmId: "20" } },
    ],
  });
  expect(getAgentsByAgency).toHaveBeenCalledWith("agency");
  expect(vi.mocked(getCrmOrdersByClientId).mock.calls).toEqual([[10], ["20"]]);
});

it("keeps the agent success body and both CRM failure responses", async () => {
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "agent", role: "agent", crmId: "10" });
  vi.mocked(getCrmOrdersByClientId).mockResolvedValue([{ id: "order" }]);
  const success = await agentGET();
  expect(success.status).toBe(200);
  expect(await success.json()).toEqual({ orders: [{ id: "order" }] });
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    vi.mocked(getCrmOrdersByClientId).mockRejectedValue(new Error("CRM unavailable"));
    const agentError = await agentGET();
    expect(agentError.status).toBe(500);
    expect(await agentError.json()).toEqual({ error: "FAILED_TO_FETCH_ORDERS" });
    vi.mocked(getAuthUser).mockResolvedValue({ sub: "agency", role: "agency" });
    vi.mocked(getAgentsByAgency).mockResolvedValue([agentFixture({ _id: "a", crmId: "10" })]);
    const agencyError = await GET();
    expect(agencyError.status).toBe(500);
    expect(await agencyError.json()).toEqual({ error: "FAILED_TO_FETCH_ORDERS" });
  } finally {
    log.mockRestore();
  }
});
