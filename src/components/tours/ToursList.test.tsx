// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import type { TourShortInfo } from "@/entities/tour";
import ToursList from "./ToursList";

vi.mock("@/components/shared/animation/AnimatedWrapper", () => ({
  default: ({ children }: { children: ReactNode }) => <li>{children}</li>,
}));

vi.mock("@/entities/tour", () => ({
  TourCard: ({ tour }: { tour: TourShortInfo }) => (
    <span data-testid="tour-card">{tour.title}</span>
  ),
}));

const tours = Array.from({ length: 15 }, (_, index) => ({
  _id: String(index),
  title: `Tour ${index}`,
})) as TourShortInfo[];

let intersectionCallback: IntersectionObserverCallback;

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function enterLoadZone() {
  act(() => {
    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

it("shows three tours on mobile, appends three, and resets for a new category", () => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 375 });
  const { rerender } = render(<ToursList key="all" tours={tours} />);
  expect(screen.getAllByTestId("tour-card")).toHaveLength(3);

  enterLoadZone();
  expect(screen.getAllByTestId("tour-card")).toHaveLength(6);

  rerender(<ToursList key="other" tours={tours.slice(0, 9)} />);
  expect(screen.getAllByTestId("tour-card")).toHaveLength(3);
});

it("shows twelve tours on desktop and appends the remainder", () => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1280 });
  render(<ToursList tours={tours} />);
  expect(screen.getAllByTestId("tour-card")).toHaveLength(12);

  enterLoadZone();
  expect(screen.getAllByTestId("tour-card")).toHaveLength(15);
  expect(screen.queryByRole("button")).toBeNull();
});
