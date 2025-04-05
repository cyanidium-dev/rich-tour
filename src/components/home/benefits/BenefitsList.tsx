import BenefitItem from "./BenefitItem";

export default function BenefitsList() {
  const benefitsList = [
    { value: "14+", description: "Років в туризмі" },
    { value: "170+", description: "Нових міст" },
    { value: "700+", description: "Виконаних турів" },
  ];

  return (
    <ul className="flex flex-col gap-5">
      {benefitsList.map((benefit, idx) => (
        <BenefitItem key={idx} benefit={benefit} />
      ))}
    </ul>
  );
}
