import axios from "axios";
import { NextResponse } from "next/server";

import client from "@/lib/sanity/client";
import { currencyQuery } from "@/lib/sanity/queries";

// ================= helpers =================

const getUsd = (currency: any, data: any) => {
    const { usd_currency, usd_percent = 0 } = currency ?? {};

    if (usd_currency) {
        return usd_currency * (1 + usd_percent / 100);
    }

    const rate = data.exchangeRate.find(
        (item: any) => item.currency === "USD"
    );

    if (!rate) {
        throw new Error("USD rate not found");
    }

    return rate.saleRateNB;
};

const getEuro = (currency: any, data: any) => {
    const { euro_currency, euro_percent = 0 } = currency ?? {};

    if (euro_currency) {
        return euro_currency * (1 + euro_percent / 100);
    }

    const rate = data.exchangeRate.find(
        (item: any) => item.currency === "EUR"
    );

    if (!rate) {
        throw new Error("EUR rate not found");
    }

    return rate.saleRateNB;
};

// ================= route =================

export async function GET() {
    try {
        // 1️⃣ Курсы из Sanity
        const currency = await client.fetch(currencyQuery);

        // 2️⃣ Правильная дата для PrivatBank
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // ⚠️ +1
        const year = date.getFullYear();

        const formattedDate = `${day}.${month}.${year}`;

        // 3️⃣ PrivatBank API
        const { data } = await axios.get(
            `https://api.privatbank.ua/p24api/exchange_rates?date=${formattedDate}`
        );

        // 4️⃣ Расчёт курсов
        const usd = getUsd(currency, data);
        const eur = getEuro(currency, data);

        // 5️⃣ Ответ
        return NextResponse.json({
            usd,
            eur,
        });
    } catch (error) {
        console.error("Currency API error:", error);

        return NextResponse.json(
            { error: "Failed to fetch currency rates" },
            { status: 500 }
        );
    }
}
