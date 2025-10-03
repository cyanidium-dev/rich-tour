import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    if (request.method === "GET") {
        try {
            const date = new Date();
            const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            const month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
            const year = date.getFullYear();
            const time = `${day}.${month}.${year}`;
            const {data} = await axios.get(`https://api.privatbank.ua/p24api/exchange_rates?date=${time}`);
            //@ts-expect-error
            const usd = data.exchangeRate.find(({currency}) => currency === "USD");
            //@ts-expect-error
            const eur = data.exchangeRate.find(({currency}) => currency === "EUR");
            return NextResponse.json({
                usd: usd.saleRateNB,
                eur: eur.saleRateNB,
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
