import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import BenefitItem from "./BenefitItem";

export default function BenefitsList() {
  const benefitsList = [
    { value: "14+", description: "Років в туризмі" },
    { value: "170+", description: "Нових міст" },
    { value: "700+", description: "Виконаних турів" },
  ];

  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="flex flex-col sm:flex-row gap-5 md:gap-4 xl:gap-5 mb-10 md:mb-5"
    >
      {benefitsList.map((benefit, idx) => (
        <BenefitItem key={idx} benefit={benefit} />
      ))}
    </AnimatedWrapper>
  );
}
