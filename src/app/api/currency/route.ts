import { NextResponse } from "next/server";

import { sanityClient } from "@/shared/api/server";
import { currencySettingsQuery } from "@/lib/sanity/queries";
import { CURRENCY_REFRESH_MS, resolveCurrencyRate } from "@/lib/currency/rate";

type CurrencyDocuments = {
  settings: { eurMarkupUah?: number; usdMarkupUah?: number } | null;
  eurCache: { rate?: number } | null;
  usdCache: { rate?: number } | null;
};

const PRIVAT_RATES_URL = "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";

export async function GET() {
  try {
    const token = process.env.SANITY_API_TOKEN;
    if (!token) throw new Error("SANITY_API_TOKEN is required for currency rate caching");

    const client = sanityClient.withConfig({ token, useCdn: false });
    const documents = await client.fetch<CurrencyDocuments>(currencySettingsQuery);
    const bankRates = fetch(PRIVAT_RATES_URL, {
      next: { revalidate: CURRENCY_REFRESH_MS / 1000 },
    }).then((response) => {
      if (!response.ok) throw new Error(`PrivatBank returned ${response.status}`);
      return response.json() as Promise<unknown>;
    });
    const saveRate = (id: string) => (rate: number) =>
      client.createOrReplace({
        _id: id,
        _type: "currencyRateCache",
        rate,
        fetchedAt: new Date().toISOString(),
      });
    const [eur, usd] = await Promise.all([
      resolveCurrencyRate(
        "EUR",
        documents.settings?.eurMarkupUah,
        documents.eurCache?.rate,
        () => bankRates,
        saveRate("privatEurRateCache"),
      ),
      resolveCurrencyRate(
        "USD",
        documents.settings?.usdMarkupUah,
        documents.usdCache?.rate,
        () => bankRates,
        saveRate("privatUsdRateCache"),
      ),
    ]);

    return NextResponse.json({ eur, usd }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Currency API error:", error);
    return NextResponse.json(
      { error: "Currency rates are unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
