import { beforeEach, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/shared/api/users-server", () => ({
  sanityUsersClient: { create: vi.fn(), fetch: vi.fn(), patch: vi.fn() },
}));
vi.mock("./crypto", () => ({
  decryptUserPayload: vi.fn(),
  encryptUserPayload: vi.fn(() => ({
    _type: "encryptedUserPayload",
    version: 1,
    iv: "iv",
    ciphertext: "ciphertext",
    tag: "tag",
  })),
  getUserIdentityLookup: vi.fn(() => "lookup"),
  normalizeUserIdentity: (value: string) => value.trim().toLowerCase(),
}));

import { sanityUsersClient } from "@/shared/api/users-server";
import { decryptUserPayload } from "./crypto";
import { createAgentUser, updateAgencyUser, updateAgentUser } from "./repository";

const agentPayload = {
  email: "Agent@Example.COM",
  companyName: "Old Company",
  legalCompanyName: "Old Legal Company",
  phone: "123",
  edrpou: "12345678",
  city: "Kyiv",
  taxForm: "fop" as const,
  password: { plain: "secret", hash: "hash" },
};
const agencyPayload = {
  legalAgencyName: "Old Legal Agency",
  marketingAgencyName: "Old Brand",
  login: "Old.Login",
  agencyEmail: "agency@example.com",
  agencyPhone: "123",
  mainOfficeEmail: "office@example.com",
  password: { plain: "secret", hash: "hash" },
};

beforeEach(() => vi.resetAllMocks());

it("writes the visible label on agent creation", async () => {
  vi.mocked(sanityUsersClient.create).mockResolvedValue({} as never);
  await createAgentUser("agent.test", agentPayload);
  expect(sanityUsersClient.create).toHaveBeenCalledWith(
    expect.objectContaining({
      displayName: "Old Company",
      displayIdentity: "agent@example.com",
    }),
  );
});

it.each([
  {
    type: "agentUser" as const,
    payload: agentPayload,
    update: () =>
      updateAgentUser("agent.test", (current) => ({
        ...current,
        companyName: "New Company",
        email: "NEW@EXAMPLE.COM",
      })),
    expected: { displayName: "New Company", displayIdentity: "new@example.com" },
  },
  {
    type: "agencyUser" as const,
    payload: agencyPayload,
    update: () =>
      updateAgencyUser("agency.test", (current) => ({
        ...current,
        marketingAgencyName: "New Brand",
        login: "New.Login",
      })),
    expected: { displayName: "New Brand", displayIdentity: "new.login" },
  },
])(
  "updates $type labels with the encrypted profile",
  async ({ type, payload, update, expected }) => {
    vi.mocked(sanityUsersClient.fetch).mockResolvedValue({
      _id: `${type === "agentUser" ? "agent" : "agency"}.test`,
      _rev: "revision-1",
      encryptedPayload: {},
    } as never);
    vi.mocked(decryptUserPayload).mockReturnValue(payload);
    const commit = vi.fn().mockResolvedValue({});
    const set = vi.fn().mockReturnValue({ commit });
    const ifRevisionId = vi.fn().mockReturnValue({ set });
    vi.mocked(sanityUsersClient.patch).mockReturnValue({ ifRevisionId } as never);

    await update();

    expect(ifRevisionId).toHaveBeenCalledWith("revision-1");
    expect(set).toHaveBeenCalledWith(expect.objectContaining(expected));
  },
);
