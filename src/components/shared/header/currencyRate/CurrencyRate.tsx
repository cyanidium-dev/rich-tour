import {useState, useEffect} from "react";
import axios from "axios";

import CurrencyItem from "./CurrencyItem";
//
// const currencyRateList = [
//   { currency: "EUR/UAH", value: "45.3" },
//   { currency: "USD/UAH", value: "42.85" },
// ];

export default function CurrencyRate() {
    const [currency, setCurrency] = useState([]);
    useEffect(()=> {
      const fetchCurrency = async()=> {
          try {
              const {data} = await axios.get("/api/currency");
              setCurrency([
                  //@ts-expect-error
                  { currency: "EUR/UAH", value: data.eur },
                  //@ts-expect-error
                  { currency: "USD/UAH", value: data.usd }
              ])
          }
          catch(error) {
              //@ts-expect-error
              console.log(error.message);
          }
      };
        fetchCurrency();
    }, []);
    if(currency.length === 0) return null;
  return (
    <div className="text-main">
      <p className="text-10bold xl:text-12bold">Актуальний курс</p>
      <ul>
        {currency.map((currencyItem, idx) => (
          <CurrencyItem key={idx} currencyItem={currencyItem} />
        ))}
      </ul>
    </div>
  );
}
