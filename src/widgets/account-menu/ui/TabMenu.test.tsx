// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import TabMenu from "./TabMenu";
import {
  getRememberedCredentials,
  saveRememberedCredentials,
} from "@/lib/auth/rememberedCredentials";

vi.mock("next/navigation", () => ({
  usePathname: () => "/agent",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/components/shared/animation/AnimatedWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

it("removes saved credentials when either account signs out", () => {
  const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
  vi.stubGlobal("fetch", fetchMock);
  for (const variant of ["agent", "agency"] as const) {
    saveRememberedCredentials({ email: "agent@example.com", password: "secret" });
    const { container, unmount } = render(<TabMenu activeTab="orders" variant={variant} />);
    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[buttons.length - 1]);
    expect(getRememberedCredentials()).toBeNull();
    expect(fetchMock).toHaveBeenLastCalledWith("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    unmount();
  }
});
