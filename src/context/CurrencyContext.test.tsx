// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { CurrencyProvider, useCurrency } from "./CurrencyContext";

function PriceProbe() {
  const { selected, convert, rate, usdRate } = useCurrency();
  return (
    <div data-testid="price">{`${convert(100)} ${selected} ${rate ?? "none"} ${usdRate ?? "none"}`}</div>
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

it("never labels an unconverted EUR amount as USD while loading", async () => {
  localStorage.setItem("selected_currency", "USD");
  let finishFetch!: (response: Response) => void;
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise<Response>((resolve) => (finishFetch = resolve))),
  );

  render(
    <CurrencyProvider>
      <PriceProbe />
    </CurrencyProvider>,
  );
  expect(screen.getByTestId("price").textContent).toBe("100 EUR none none");

  finishFetch({ ok: true, json: async () => ({ eur: 51, usd: 42.5 }) } as Response);
  await waitFor(() => expect(screen.getByTestId("price").textContent).toBe("120 USD 51 42.5"));
});

it("keeps both last rates during an API outage", async () => {
  localStorage.setItem("selected_currency", "USD");
  localStorage.setItem("last_eur_uah_rate", "50");
  localStorage.setItem("last_usd_uah_rate", "40");
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  render(
    <CurrencyProvider>
      <PriceProbe />
    </CurrencyProvider>,
  );
  await waitFor(() => expect(screen.getByTestId("price").textContent).toBe("125 USD 50 40"));
  error.mockRestore();
});
