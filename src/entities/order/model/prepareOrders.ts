import { transformOrders } from "./mapOrders";
import type { CrmOrder } from "./schema";
import type { OrderTableRow } from "./types";
export type OrdersMode = "active" | "archive" | "all";

const archiveOrderStatusList: unknown[] = ["42", "48", "84"];

function isTodayOrFuture(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  return date >= today;
}

export function sortOrdersByIdDesc(orders: OrderTableRow[]): OrderTableRow[] {
  return [...orders].sort((a, b) => {
    return Number(b.id) - Number(a.id);
  });
}

export function prepareOrders(orders: CrmOrder[], mode: OrdersMode): OrderTableRow[] {
  let preparedOrders = orders;
  if (mode === "active") {
    preparedOrders = orders
      .filter(({ statusid }) => !archiveOrderStatusList.includes(statusid))
      .filter((item) => {
        const value = item.customfields?.Datazakinchennyaturu?.value;

        if (!value) return false;

        return isTodayOrFuture(value);
      });
  }

  if (mode === "archive") {
    preparedOrders = orders.filter((item) => {
      const isArchivedByStatus = archiveOrderStatusList.includes(item.statusid);

      const endDate = item.customfields?.Datazakinchennyaturu?.value;
      const isPastTour = endDate ? !isTodayOrFuture(endDate) : false;

      return isArchivedByStatus || isPastTour;
    });
  }

  if (mode === "all") {
    preparedOrders = orders;
  }

  return transformOrders(preparedOrders);
}
