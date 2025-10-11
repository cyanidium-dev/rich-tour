import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/sanity";
import {currencyQuery} from "@/lib/queries";

//@ts-expect-error
const getUsd = (currency, data) => {
    const {usd_currency, usd_percent = 0} = currency;
    if(usd_currency) {
        return usd_currency * (1 + usd_percent / 100);
    }
    //@ts-expect-error
    return data.exchangeRate.find(({currency}) => currency === "USD").saleRateNB;
}

//@ts-expect-error
const getEuro = (currency, data) => {
    const {euro_currency, euro_percent = 0} = currency;
    if(euro_currency) {
        return euro_currency * (1 + euro_percent / 100);
    }
    //@ts-expect-error
    return data.exchangeRate.find(({currency}) => currency === "EUR").saleRateNB;
}

export async function GET(request: NextRequest) {
    if (request.method === "GET") {
        try {
            const currency = await client.fetch(currencyQuery);
            const date = new Date();
            const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            const month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
            const year = date.getFullYear();
            const time = `${day}.${month}.${year}`;
            const {data} = await axios.get(`https://api.privatbank.ua/p24api/exchange_rates?date=${time}`);
            const usd = getUsd(currency, data);
            const eur = getEuro(currency, data);
            return NextResponse.json({
                usd,
                eur,
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return NextResponse.json(
                { error: "Failed to append data to the sheet" },
                { status: 500 }
            );
        }
    }
}
