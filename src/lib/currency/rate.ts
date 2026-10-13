export const CURRENCY_REFRESH_MS = 15 * 60 * 1000;

export function isValidRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function parsePrivatEurSale(payload: unknown): number {
  if (!Array.isArray(payload)) throw new Error("Invalid PrivatBank response");

  const row = payload.find((item) => item?.ccy === "EUR" && item?.base_ccy === "UAH");
  const rawSale = row?.sale;
  if (typeof rawSale !== "string" && typeof rawSale !== "number") {
    throw new Error("EUR/UAH sale rate is missing");
  }

  const sale = Number(rawSale);
  if (!isValidRate(sale)) throw new Error("Invalid EUR/UAH sale rate");
  return sale;
}

export function parseMarkup(value: unknown): number {
  if (value === undefined || value === null) return 0;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error("Invalid EUR markup");
  }
  return value;
}

export async function resolveEurRate(
  markup: unknown,
  cachedSale: unknown,
  fetchBankRates: () => Promise<unknown>,
  saveSale: (sale: number) => Promise<unknown>,
): Promise<number> {
  const markupUah = parseMarkup(markup);
  let sale: number;

  try {
    sale = parsePrivatEurSale(await fetchBankRates());
  } catch (error) {
    if (!isValidRate(cachedSale)) throw error;
    return cachedSale + markupUah;
  }

  if (sale !== cachedSale) {
    try {
      await saveSale(sale);
    } catch (error) {
      console.error("Failed to save PrivatBank EUR rate:", error);
    }
  }

  return sale + markupUah;
}
