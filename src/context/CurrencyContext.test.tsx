// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { CurrencyProvider, useCurrency } from "./CurrencyContext";

function PriceProbe() {
  const { selected, convert, rate } = useCurrency();
  return <div data-testid="price">{`${convert(100)} ${selected} ${rate ?? "none"}`}</div>;
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

it("never labels an unconverted EUR amount as UAH while loading", async () => {
  localStorage.setItem("selected_currency", "UAH");
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
  expect(screen.getByTestId("price").textContent).toBe("100 EUR none");

  finishFetch({ ok: true, json: async () => ({ eur: 51.02 }) } as Response);
  await waitFor(() => expect(screen.getByTestId("price").textContent).toBe("5102 UAH 51.02"));
});

it("keeps the last rate during an API outage", async () => {
  localStorage.setItem("selected_currency", "UAH");
  localStorage.setItem("last_eur_uah_rate", "50");
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  render(
    <CurrencyProvider>
      <PriceProbe />
    </CurrencyProvider>,
  );
  await waitFor(() => expect(screen.getByTestId("price").textContent).toBe("5000 UAH 50"));
  error.mockRestore();
});
