// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import ScrollToTopOnNavigation from "./ScrollToTopOnNavigation";

const navigation = vi.hoisted(() => ({ pathname: "/about" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

beforeEach(() => {
  navigation.pathname = "/about";
  window.history.replaceState({}, "", "/about");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("starts a new page at the top but leaves the initial load and query changes alone", () => {
  const view = render(<ScrollToTopOnNavigation />);
  expect(window.scrollTo).not.toHaveBeenCalled();

  window.history.pushState({}, "", "/about?page=2");
  view.rerender(<ScrollToTopOnNavigation />);
  expect(window.scrollTo).not.toHaveBeenCalled();

  window.history.pushState({}, "", "/reviews");
  navigation.pathname = "/reviews";
  view.rerender(<ScrollToTopOnNavigation />);
  expect(window.scrollTo).toHaveBeenCalledExactlyOnceWith({
    top: 0,
    left: 0,
    behavior: "instant",
  });
});

it("preserves history restoration and hash navigation", () => {
  const view = render(<ScrollToTopOnNavigation />);

  window.history.pushState({}, "", "/reviews");
  fireEvent.popState(window);
  navigation.pathname = "/reviews";
  view.rerender(<ScrollToTopOnNavigation />);
  expect(window.scrollTo).not.toHaveBeenCalled();

  window.history.pushState({}, "", "/contacts#address");
  navigation.pathname = "/contacts";
  view.rerender(<ScrollToTopOnNavigation />);
  expect(window.scrollTo).not.toHaveBeenCalled();

  window.history.pushState({}, "", "/about");
  navigation.pathname = "/about";
  view.rerender(<ScrollToTopOnNavigation />);
  expect(window.scrollTo).toHaveBeenCalledOnce();
});
