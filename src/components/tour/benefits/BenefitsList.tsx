import { TourBenefitListItem } from "@/types/tour";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import BenefitsListItem from "./BenefitsListItem";

interface BenefitsListProps {
  list: TourBenefitListItem[];
}

export default function BenefitsList({ list }: BenefitsListProps) {
  if (!list || !list.length) return null;

  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="flex flex-col gap-y-5 xl:gap-y-7"
    >
      {list.map((listItem, idx) => (
        <BenefitsListItem key={idx} listItem={listItem} />
      ))}
    </AnimatedWrapper>
  );
}
