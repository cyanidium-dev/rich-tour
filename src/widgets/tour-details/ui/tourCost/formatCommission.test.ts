import { describe, expect, it } from "vitest";
import { formatCommission } from "./formatCommission";

describe("agent commission display", () => {
  it("converts a fixed EUR commission to USD with the tour rate", () => {
    const fixed = { type: "fixed", value: 10 };
    expect(formatCommission(fixed, "EUR", (amount) => amount)).toBe("10 €");
    expect(formatCommission(fixed, "USD", (amount) => Math.round(amount * 1.2))).toBe("12 $");
  });

  it("keeps percentage commissions as percentages", () => {
    expect(formatCommission({ type: "percent", value: 12 }, "USD", () => 999)).toBe("12%");
  });
});
