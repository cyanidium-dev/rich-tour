interface CurrencyItemProps {
  currencyItem: { currency: string; value: string };
}

export default function CurrencyItem({ currencyItem }: CurrencyItemProps) {
  const { currency, value } = currencyItem;

  return (
    <li className="flex gap-x-1 text-10reg xl:text-12reg">
      <p>{currency}</p>
      <p>{value}</p>
    </li>
  );
}
