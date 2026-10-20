import { afterEach, beforeEach, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/shared/api/server", () => ({
  sanityClient: { withConfig: vi.fn() },
}));

import { POST } from "./route";
import { sanityClient } from "@/shared/api/server";

const create = vi.fn();
const request = (value: unknown) =>
  new Request("http://localhost:3000/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });

beforeEach(() => {
  vi.resetAllMocks();
  process.env.SANITY_API_TOKEN = "write-token";
  vi.mocked(sanityClient.withConfig).mockReturnValue({ create } as never);
});

afterEach(() => {
  delete process.env.SANITY_API_TOKEN;
});

it("creates a review in Sanity for moderation", async () => {
  create.mockResolvedValue({ _id: "review-1" });
  const response = await POST(
    request({
      name: "Марія",
      phone: "+38 (067) 123-45-67",
      message: "Чудова подорож!",
    }),
  );

  expect(response.status).toBe(201);
  expect(sanityClient.withConfig).toHaveBeenCalledWith({ token: "write-token", useCdn: false });
  expect(create).toHaveBeenCalledWith({
    _type: "review",
    name: "Марія",
    phone: "+38 (067) 123-45-67",
    text: "Чудова подорож!",
    verified: false,
  });
});

it("rejects an empty review without writing", async () => {
  const response = await POST(
    request({
      name: "Марія",
      phone: "+38 (067) 123-45-67",
      message: "   ",
    }),
  );

  expect(response.status).toBe(400);
  expect(create).not.toHaveBeenCalled();
});

it("shows a server failure instead of acknowledging an unsaved review", async () => {
  create.mockRejectedValue(new Error("Sanity unavailable"));
  const response = await POST(
    request({
      name: "Марія",
      phone: "+38 (067) 123-45-67",
      message: "Чудова подорож!",
    }),
  );

  expect(response.status).toBe(503);
});
