import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { encodeSignatureHeader } from "@sanity/webhook";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidateTag: vi.fn(), revalidatePath: vi.fn() }));

import { revalidatePath, revalidateTag } from "next/cache";
import { getInvalidationForType } from "./invalidation";
import { POST } from "./route";

const secret = "test-secret-with-at-least-32-characters";
const endpoint = "https://example.com/api/webhooks/sanity/revalidate";

async function signedRequest(
  body: string,
  overrides: Record<string, string> = {},
): Promise<NextRequest> {
  const signature = await encodeSignatureHeader(body, Date.now(), secret);
  return new NextRequest(endpoint, {
    method: "POST",
    headers: {
      "sanity-webhook-signature": signature,
      "sanity-project-id": "elggedkx",
      "sanity-dataset": "production",
      ...overrides,
    },
    body,
  });
}

beforeEach(() => {
  process.env.SANITY_REVALIDATE_SECRET = secret;
  vi.clearAllMocks();
});

afterEach(() => {
  delete process.env.SANITY_REVALIDATE_SECRET;
});

it("maps every public document type to its cached data and routes", () => {
  expect(getInvalidationForType("tour-basic")).toEqual(getInvalidationForType("tour-to-date"));
  expect(getInvalidationForType("tour-basic")).toEqual({
    tag: "tours",
    paths: [
      { path: "/" },
      { path: "/tours" },
      { path: "/search" },
      { path: "/tours/[slug]", type: "page" },
    ],
  });
  expect(getInvalidationForType("tour-category")?.tag).toBe("tour-categories");
  expect(getInvalidationForType("country")?.paths).toContainEqual({ path: "/search" });
  expect(getInvalidationForType("faq")?.paths).toEqual([{ path: "/" }]);
  expect(getInvalidationForType("doc")?.paths).toEqual([{ path: "/about" }]);
  expect(getInvalidationForType("team")?.paths).toEqual([{ path: "/about" }]);
  expect(getInvalidationForType("review")?.paths).toContainEqual({ path: "/reviews" });
  expect(getInvalidationForType("siteSettings")?.paths).toEqual([{ path: "/agent" }]);
  expect(getInvalidationForType("agentUser")).toBeUndefined();
  expect(getInvalidationForType("currencyRateCache")).toBeUndefined();
});

it("rejects unsigned, incorrectly signed and wrong-dataset requests without invalidating", async () => {
  const body = JSON.stringify({ _type: "tour-basic" });
  const unsigned = new NextRequest(endpoint, { method: "POST", body });
  expect((await POST(unsigned)).status).toBe(401);

  const wrongSignature = await signedRequest(body, { "sanity-webhook-signature": "invalid" });
  expect((await POST(wrongSignature)).status).toBe(401);

  const wrongDataset = await signedRequest(body, { "sanity-dataset": "users-production" });
  expect((await POST(wrongDataset)).status).toBe(400);
  expect(revalidateTag).not.toHaveBeenCalled();
  expect(revalidatePath).not.toHaveBeenCalled();
});

it("rejects malformed signed payloads and skips unrelated documents", async () => {
  const invalidJson = await signedRequest("{");
  expect((await POST(invalidJson)).status).toBe(400);
  const missingType = await signedRequest("{}");
  expect((await POST(missingType)).status).toBe(400);
  const unrelated = await signedRequest(JSON.stringify({ _type: "currencyRateCache" }));
  expect(await (await POST(unrelated)).json()).toEqual({ ok: true, skipped: true });
  expect(revalidateTag).not.toHaveBeenCalled();
  expect(revalidatePath).not.toHaveBeenCalled();
});

it("expires tour data and pages after a valid signed webhook", async () => {
  const request = await signedRequest(JSON.stringify({ _type: "tour-to-date" }));
  const response = await POST(request);

  expect(response.status).toBe(200);
  expect(revalidateTag).toHaveBeenCalledWith("tours", { expire: 0 });
  expect(revalidatePath).toHaveBeenCalledWith("/tours/[slug]", "page");
  expect(revalidatePath).toHaveBeenCalledWith("/tours", undefined);
});
