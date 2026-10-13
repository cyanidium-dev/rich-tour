// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type ReactNode, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useReviewsItemsPerPage } from "@/hooks/useReviewsItemsPerPage";
import { useToursItemsPerPage } from "@/hooks/useToursItemsPerPage";
import { usePromotionItemsPerPage } from "@/hooks/usePromotionItemsPerPage";
import useOrdersPerPage from "@/hooks/useOrdersPerPage";
import Pagination from "./Pagination";

vi.mock("next/navigation", () => {
  const router = { push: vi.fn(), replace: vi.fn() };
  const params = new URLSearchParams("page=5");
  return {
    useRouter: () => router,
    usePathname: () => "/reviews",
    useSearchParams: () => params,
  };
});

vi.mock("../animation/AnimatedWrapper", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  (useSearchParams() as unknown as URLSearchParams).set("page", "5");
});

it.each([
  ["reviews on desktop", useReviewsItemsPerPage, 1280, 23, 5, [21, 22, 23]],
  ["reviews on mobile", useReviewsItemsPerPage, 375, 23, 6, [21, 22, 23]],
  ["tours and search on mobile", useToursItemsPerPage, 375, 17, 6, [16, 17]],
  ["tours and search on tablet", useToursItemsPerPage, 700, 15, 4, [13, 14, 15]],
  ["home promotions on tablet", usePromotionItemsPerPage, 900, 10, 4, [10]],
  ["agent and agency orders on mobile", useOrdersPerPage, 375, 22, 5, [21, 22]],
] as const)(
  "keeps the last %s page on refresh",
  async (_section, useItemsPerPage, width, itemCount, page, expected) => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
    (useSearchParams() as unknown as URLSearchParams).set("page", String(page));
    const items = Array.from({ length: itemCount }, (_, index) => index + 1);

    render(
      <Pagination
        items={items}
        scrollTargetId="missing"
        useItemsPerPage={useItemsPerPage}
        renderItems={(pageItems) => (
          <div>
            {pageItems.map((item) => (
              <span data-testid="item" key={item}>
                {item}
              </span>
            ))}
          </div>
        )}
      />,
    );

    await waitFor(() =>
      expect(screen.getAllByTestId("item").map((item) => Number(item.textContent))).toEqual(
        expected,
      ),
    );
    expect(useRouter().replace).not.toHaveBeenCalled();
  },
);

function MountOnlyList({ items }: { items: number[] }) {
  const [visibleCount] = useState(items.length);
  return (
    <div>
      {items.slice(0, visibleCount).map((item) => (
        <span data-testid="visible-item" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

it("remounts page content when returning from a short last page", async () => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1280 });
  const items = Array.from({ length: 23 }, (_, index) => index + 1);

  render(
    <Pagination
      items={items}
      scrollTargetId="missing"
      useItemsPerPage={useReviewsItemsPerPage}
      renderItems={(pageItems) => <MountOnlyList items={pageItems} />}
    />,
  );

  await waitFor(() => expect(screen.getAllByTestId("visible-item")).toHaveLength(3));
  fireEvent.click(screen.getByRole("button", { name: "4" }));
  expect(screen.getAllByTestId("visible-item").map((item) => item.textContent)).toEqual([
    "16",
    "17",
    "18",
    "19",
    "20",
  ]);
});
