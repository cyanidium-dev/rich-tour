// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { TourShortInfo } from "../model/types";
import TourCard from "./TourCard";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));
vi.mock("@/components/shared/animation/AnimatedWrapper", () => ({
  default: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
}));
vi.mock("@/shared/ui", () => ({
  SecondaryButton: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
}));

afterEach(cleanup);

const tour: TourShortInfo = {
  _id: "tour",
  slug: { current: "tour" },
  title: "Тур",
  description: "Опис",
  duration: 5,
  image: { url: "/tour.jpg" },
};

it.each([false, true])("shows early booking alongside a promotion (promotion=%s)", (isOnPromo) => {
  render(<TourCard tour={{ ...tour, earlyBooking: true, isOnPromo }} />);
  expect(screen.getByText("Раннє бронювання")).toBeTruthy();
  expect(Boolean(screen.queryByText("Акція!"))).toBe(isOnPromo);
});

it("omits early booking when the setting is absent", () => {
  render(<TourCard tour={{ ...tour, isOnPromo: true }} />);
  expect(screen.queryByText("Раннє бронювання")).toBeNull();
  expect(screen.getByText("Акція!")).toBeTruthy();
});
