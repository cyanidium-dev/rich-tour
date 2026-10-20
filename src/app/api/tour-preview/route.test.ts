import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { SignJWT } from "jose";

vi.mock("server-only", () => ({}));

import { POST } from "./route";
import { createTourPreviewSession, verifyTourPreviewSession } from "@/lib/tour-preview/session";

const secret = "preview-session-secret-with-at-least-32-characters";

function request(id = "departure-1", origin?: string) {
  return new NextRequest("http://localhost:3000/api/tour-preview", {
    method: "POST",
    headers: { ...(origin ? { origin } : {}), "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id, token: "personal-sanity-token" }),
  });
}

beforeEach(() => {
  process.env.PREVIEW_SESSION_SECRET = secret;
  process.env.SANITY_API_TOKEN = "server-read-token";
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  delete process.env.PREVIEW_SESSION_SECRET;
  delete process.env.SANITY_API_TOKEN;
  vi.unstubAllGlobals();
});

it("exchanges only an administrator's Sanity token for a tour-scoped preview cookie", async () => {
  vi.mocked(fetch).mockImplementation(
    async () =>
      new Response(JSON.stringify({ id: "admin-1", roles: [{ name: "administrator" }] }), {
        status: 200,
      }),
  );
  const response = await POST(request());

  expect(response.status).toBe(303);
  expect(response.headers.get("location")).toBe("http://localhost:3000/tours/preview/departure-1");
  expect(response.cookies.get("tour_preview_session")?.path).toBe("/tours/preview/departure-1");
  expect(
    await verifyTourPreviewSession(
      response.cookies.get("tour_preview_session")?.value,
      "departure-1",
    ),
  ).toBe(true);
  expect(
    await verifyTourPreviewSession(
      response.cookies.get("tour_preview_session")?.value,
      "departure-2",
    ),
  ).toBe(false);
  expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({
    headers: { Authorization: "Bearer personal-sanity-token" },
    cache: "no-store",
  });
  expect((await POST(request("departure-1", "https://studio.example"))).status).toBe(303);
});

it("rejects other roles, invalid IDs and Sanity failures", async () => {
  vi.mocked(fetch).mockResolvedValue(
    new Response(JSON.stringify({ id: "editor-1", roles: [{ name: "editor" }] }), {
      status: 200,
    }),
  );
  expect(await (await POST(request())).json()).toEqual({ error: "ADMIN_REQUIRED" });
  expect((await POST(request("drafts.departure-1"))).status).toBe(400);
  vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));
  expect(await (await POST(request())).json()).toEqual({ error: "INVALID_STUDIO_SESSION" });
  vi.mocked(fetch).mockRejectedValue(new Error("Sanity unavailable"));
  expect((await POST(request())).status).toBe(503);
});

it("rejects missing, mismatched and expired preview sessions", async () => {
  expect(await verifyTourPreviewSession(undefined, "departure-1")).toBe(false);
  const valid = await createTourPreviewSession("departure-1", "admin-1");
  expect(await verifyTourPreviewSession(valid, "departure-2")).toBe(false);
  const expired = await new SignJWT({ docId: "departure-1" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("rich-tour")
    .setAudience("tour-preview")
    .setSubject("admin-1")
    .setExpirationTime("1 second ago")
    .sign(new TextEncoder().encode(secret));
  expect(await verifyTourPreviewSession(expired, "departure-1")).toBe(false);
});
