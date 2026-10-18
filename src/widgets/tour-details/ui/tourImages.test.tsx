// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { Tour } from "@/entities/tour";
import Hero from "./hero/Hero";
import Benefits from "./benefits/Benefits";
import TourCost from "./tourCost/TourCost";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));
vi.mock("@/components/shared/animation/AnimatedWrapper", () => ({
  default: ({
    as: Element = "div",
    children,
    className,
  }: React.PropsWithChildren<{ as?: "div" | "h1" | "h2" | "p"; className?: string }>) => (
    <Element className={className}>{children}</Element>
  ),
}));
vi.mock("@/shared/ui/index", () => ({
  Container: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
  MainButton: ({ children }: React.PropsWithChildren) => <button>{children}</button>,
}));
vi.mock("@/components/shared/booking/BookingWithButton", () => ({
  default: () => <button>Book</button>,
}));
vi.mock("./tourCost/Calendar", () => ({ default: () => <div data-testid="calendar" /> }));
vi.mock("./benefits/BenefitsList", () => ({
  default: ({ list }: { list: { text: string }[] }) => (
    <p>{list.map((item) => item.text).join(" ")}</p>
  ),
}));
vi.mock("./benefits/AnimatedArrowDesk", () => ({ default: () => null }));
vi.mock("./benefits/AnimatedArrowMob", () => ({ default: () => null }));
vi.mock("./tourCost/AnimatedArrowDesk", () => ({ default: () => null }));

afterEach(cleanup);

const tour = {
  title: "Departure",
  duration: 5,
  heroImages: {},
  costImages: {},
  benefits: { list: [{ text: "Benefit" }] },
} as Tour;
const contact = { companyName: undefined, email: undefined, phone: undefined };

it("renders remaining content when every image slot is empty", () => {
  const { container } = render(
    <>
      <Hero tour={tour} {...contact} />
      <Benefits tour={tour} />
      <TourCost tour={tour} isLogin={false} {...contact} />
    </>,
  );
  expect(container.querySelectorAll("img")).toHaveLength(0);
  expect(screen.getByText("Benefit")).toBeTruthy();
  expect(screen.getByTestId("calendar")).toBeTruthy();
});

it.each([false, true])("renders both cost images for isLogin=%s", (isLogin) => {
  const withImages: Tour = {
    ...tour,
    heroImages: { main: { url: "/departure.jpg", alt: "Departure" } },
    costImages: {
      short: { url: "/short.jpg", alt: "Short" },
      tall: { url: "/tall.jpg", alt: "Tall" },
    },
  };
  const { container } = render(
    <>
      <Hero tour={withImages} {...contact} />
      <TourCost tour={withImages} isLogin={isLogin} {...contact} />
    </>,
  );
  expect(
    Array.from(container.querySelectorAll("img"), (image) => image.getAttribute("src")),
  ).toEqual(["/departure.jpg", "/short.jpg", "/tall.jpg"]);
});
