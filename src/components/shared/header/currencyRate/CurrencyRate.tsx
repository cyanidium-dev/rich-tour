import CurrencyItem from "./CurrencyItem";

const currencyRateList = [
  { currency: "EUR/UAH", value: "45.3" },
  { currency: "USD/UAH", value: "42.85" },
];

export default function CurrencyRate() {
  return (
    <div className="text-main">
      <p className="text-10bold xl:text-12bold">Актуальний курс</p>
      <ul>
        {currencyRateList.map((currencyItem, idx) => (
          <CurrencyItem key={idx} currencyItem={currencyItem} />
        ))}
      </ul>
    </div>
  );
}
