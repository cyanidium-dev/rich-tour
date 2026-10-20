import { describe, expect, it, vi } from "vitest";
import { parsePrivatEurSale, parsePrivatSale, resolveCurrencyRate, resolveEurRate } from "./rate";

const bankResponse = [
  { ccy: "USD", base_ccy: "UAH", sale: "42.00" },
  { ccy: "EUR", base_ccy: "UAH", buy: "50.33000", sale: "51.02041" },
];

describe("EUR/UAH rate", () => {
  it("uses PrivatBank's EUR sale rate rather than its buy or USD rate", () => {
    expect(parsePrivatEurSale(bankResponse)).toBe(51.02041);
    expect(parsePrivatSale(bankResponse, "USD")).toBe(42);
  });

  it("adds a zero or fixed UAH markup per euro and saves a new bank rate", async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const fetchRates = vi.fn().mockResolvedValue(bankResponse);

    expect(await resolveEurRate(0, null, fetchRates, save)).toBe(51.02041);
    expect(await resolveEurRate(1.56, 50, fetchRates, save)).toBeCloseTo(52.58041);
    expect(save).toHaveBeenCalledWith(51.02041);
  });

  it("uses the shared saved rate when the bank fails or returns invalid data", async () => {
    const save = vi.fn();
    expect(
      await resolveEurRate(
        2,
        50,
        async () => {
          throw new Error("Bank unavailable");
        },
        save,
      ),
    ).toBe(52);
    expect(await resolveEurRate(0, 50, async () => [{ ccy: "EUR", sale: "0" }], save)).toBe(50);
    expect(save).not.toHaveBeenCalled();
  });

  it("rejects invalid bank data when no shared rate exists", async () => {
    await expect(resolveEurRate(0, null, async () => [], vi.fn())).rejects.toThrow();
    await expect(resolveEurRate(-1, 50, async () => bankResponse, vi.fn())).rejects.toThrow(
      "Invalid EUR markup",
    );
  });

  it("adds the USD markup and uses its own cached sale rate during an outage", async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    expect(await resolveCurrencyRate("USD", 0.5, null, async () => bankResponse, save)).toBe(42.5);
    expect(save).toHaveBeenCalledWith(42);
    expect(
      await resolveCurrencyRate(
        "USD",
        0.5,
        41,
        async () => {
          throw new Error("Bank unavailable");
        },
        save,
      ),
    ).toBe(41.5);
    await expect(
      resolveCurrencyRate("USD", -1, 41, async () => bankResponse, save),
    ).rejects.toThrow("Invalid USD markup");
  });
});
