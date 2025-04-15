import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import BenefitItem from "./BenefitItem";

export default function BenefitsList() {
  const benefitsList = [
    {
      value: "100%",
      description: "Користі для вас",
      image: "/images/dashboard/telegram/imageOne.webp",
    },
    {
      value: "470+",
      description: "Підписників",
      image: "/images/dashboard/telegram/imageTwo.webp",
    },
    {
      value: "100+",
      description: "Пропозицій",
      image: "/images/dashboard/telegram/imageThree.webp",
    },
  ];
  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="flex flex-col sm:flex-row gap-5 md:gap-4 xl:gap-5 lg:w-[57.6%]"
    >
      {benefitsList.map((benefit, idx) => (
        <BenefitItem key={idx} benefit={benefit} />
      ))}
    </AnimatedWrapper>
  );
}
