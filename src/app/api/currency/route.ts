import { NextResponse } from "next/server";

import { sanityClient } from "@/shared/api/server";
import { currencySettingsQuery } from "@/lib/sanity/queries";
import { CURRENCY_REFRESH_MS, resolveEurRate } from "@/lib/currency/rate";

type CurrencyDocuments = {
  settings: { eurMarkupUah?: number } | null;
  cache: { rate?: number } | null;
};

const PRIVAT_EUR_URL = "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";

export async function GET() {
  try {
    const token = process.env.SANITY_API_TOKEN;
    if (!token) throw new Error("SANITY_API_TOKEN is required for currency rate caching");

    const client = sanityClient.withConfig({ token, useCdn: false });
    const documents = await client.fetch<CurrencyDocuments>(currencySettingsQuery);
    const eur = await resolveEurRate(
      documents.settings?.eurMarkupUah,
      documents.cache?.rate,
      async () => {
        const response = await fetch(PRIVAT_EUR_URL, {
          next: { revalidate: CURRENCY_REFRESH_MS / 1000 },
        });
        if (!response.ok) throw new Error(`PrivatBank returned ${response.status}`);
        return response.json();
      },
      (rate) =>
        client.createOrReplace({
          _id: "privatEurRateCache",
          _type: "currencyRateCache",
          rate,
          fetchedAt: new Date().toISOString(),
        }),
    );

    return NextResponse.json({ eur }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Currency API error:", error);
    return NextResponse.json(
      { error: "EUR/UAH rate is unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
