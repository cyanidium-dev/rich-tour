import type { OrderTableRow } from "@/entities/order";
import type { OrdersFiltersState } from "./ordersFiltersModel";

function toTimeStart(value: unknown): number | null {
  if (!value) return null;

  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? null : time;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "year" in value &&
    "month" in value &&
    "day" in value
  ) {
    const v = value as { year: number; month: number; day: number };
    const date = new Date(v.year, v.month - 1, v.day, 0, 0, 0, 0);
    const time = date.getTime();
    return Number.isNaN(time) ? null : time;
  }

  return null;
}

function toTimeEnd(value: unknown): number | null {
  if (!value) return null;

  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? null : time;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "year" in value &&
    "month" in value &&
    "day" in value
  ) {
    const v = value as { year: number; month: number; day: number };
    const date = new Date(v.year, v.month - 1, v.day, 23, 59, 59, 999);
    const time = date.getTime();
    return Number.isNaN(time) ? null : time;
  }

  return null;
}

function parseOrderDate(value: string | null | undefined, endOfDay = false): number | null {
  if (!value) return null;

  let normalized = value;

  if (value.includes(".")) {
    const [day, month, year] = value.split(".");
    normalized = `${year}-${month}-${day}`;
  }

  const date = endOfDay
    ? new Date(`${normalized}T23:59:59.999`)
    : new Date(`${normalized}T00:00:00.000`);

  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
}

export function filterOrders(orders: OrderTableRow[], filters: OrdersFiltersState) {
  const periodFrom = toTimeStart(filters.period.from);
  const periodTo = toTimeEnd(filters.period.to);

  return orders.filter((order) => {
    if (filters.search.trim().length >= 2) {
      const q = filters.search.trim().toLowerCase();

      const haystack = `
                ${order.orderNumber}
                ${order.tourTitle}
                ${order.tourists}
                ${order.agentName ?? ""}
                ${order.comment}
            `.toLowerCase();

      if (!haystack.includes(q)) {
        return false;
      }
    }

    if (filters.agentId && order.agentId !== filters.agentId) {
      return false;
    }

    if (filters.status && order.status !== filters.status) {
      return false;
    }

    if (filters.hasDebt === "так") {
      if (Number(order.remainingAmount) === 0) {
        return false;
      }
    }

    if (filters.hasDebt === "ні") {
      if (Number(order.remainingAmount) !== 0) {
        return false;
      }
    }

    if (periodFrom !== null || periodTo !== null) {
      const orderStart = parseOrderDate(order.startDate, false);
      const orderEnd = parseOrderDate(order.endDate, true);

      if (orderStart === null || orderEnd === null) {
        return false;
      }

      if (periodFrom !== null && orderEnd < periodFrom) {
        return false;
      }

      if (periodTo !== null && orderStart > periodTo) {
        return false;
      }
    }

    return true;
  });
}
