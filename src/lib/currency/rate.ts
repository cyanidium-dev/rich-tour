export const CURRENCY_REFRESH_MS = 15 * 60 * 1000;

export function isValidRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

type BankCurrency = "EUR" | "USD";

export function parsePrivatSale(payload: unknown, currency: BankCurrency): number {
  if (!Array.isArray(payload)) throw new Error("Invalid PrivatBank response");

  const row = payload.find((item) => item?.ccy === currency && item?.base_ccy === "UAH");
  const rawSale = row?.sale;
  if (typeof rawSale !== "string" && typeof rawSale !== "number") {
    throw new Error(`${currency}/UAH sale rate is missing`);
  }

  const sale = Number(rawSale);
  if (!isValidRate(sale)) throw new Error(`Invalid ${currency}/UAH sale rate`);
  return sale;
}

export function parsePrivatEurSale(payload: unknown): number {
  return parsePrivatSale(payload, "EUR");
}

export function parseMarkup(value: unknown, currency: BankCurrency = "EUR"): number {
  if (value === undefined || value === null) return 0;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid ${currency} markup`);
  }
  return value;
}

export async function resolveCurrencyRate(
  currency: BankCurrency,
  markup: unknown,
  cachedSale: unknown,
  fetchBankRates: () => Promise<unknown>,
  saveSale: (sale: number) => Promise<unknown>,
): Promise<number> {
  const markupUah = parseMarkup(markup, currency);
  let sale: number;

  try {
    sale = parsePrivatSale(await fetchBankRates(), currency);
  } catch (error) {
    if (!isValidRate(cachedSale)) throw error;
    return cachedSale + markupUah;
  }

  if (sale !== cachedSale) {
    try {
      await saveSale(sale);
    } catch (error) {
      console.error(`Failed to save PrivatBank ${currency} rate:`, error);
    }
  }

  return sale + markupUah;
}

export function resolveEurRate(
  markup: unknown,
  cachedSale: unknown,
  fetchBankRates: () => Promise<unknown>,
  saveSale: (sale: number) => Promise<unknown>,
): Promise<number> {
  return resolveCurrencyRate("EUR", markup, cachedSale, fetchBankRates, saveSale);
}
