import { describe, expect, it } from "vitest";
import { formatCommission } from "./formatCommission";

describe("agent commission display", () => {
  it("converts a fixed EUR commission to UAH with the tour rate", () => {
    const fixed = { type: "fixed", value: 10 };
    expect(formatCommission(fixed, "EUR", (amount) => amount)).toBe("10 €");
    expect(formatCommission(fixed, "UAH", (amount) => Math.round(amount * 51.02041))).toBe("510 ₴");
  });

  it("keeps percentage commissions as percentages", () => {
    expect(formatCommission({ type: "percent", value: 12 }, "UAH", () => 999)).toBe("12%");
  });
});
