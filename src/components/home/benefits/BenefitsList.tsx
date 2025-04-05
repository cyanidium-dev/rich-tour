import BenefitItem from "./BenefitItem";

export default function BenefitsList() {
  const benefitsList = [
    { value: "14+", description: "Років в туризмі" },
    { value: "170+", description: "Нових міст" },
    { value: "700+", description: "Виконаних турів" },
  ];

  return (
    <ul className="flex flex-col sm:flex-row gap-5 md:gap-4 xl:gap-5 mb-10 md:mb-5">
      {benefitsList.map((benefit, idx) => (
        <BenefitItem key={idx} benefit={benefit} />
      ))}
    </ul>
  );
}
