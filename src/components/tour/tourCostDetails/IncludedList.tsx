import {
  fadeInAnimation,
  listVariants,
} from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import ListItem from "./ListItem";

interface IncludedListProps {
  includedInCost: string[];
}

export default function IncludedList({ includedInCost }: IncludedListProps) {
  if (!includedInCost || !includedInCost.length) return null;

  return (
    <div className="md:w-1/2 md:pr-10 xl:pr-[102px] md:border-r border-black">
      <AnimatedWrapper
        as="h2"
        animation={fadeInAnimation({ y: 30 })}
        className="mb-7 xl:mb-8 text-24med xl:text-32med"
      >
        У вартість туру включено
      </AnimatedWrapper>
      <AnimatedWrapper
        as="ul"
        animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
        className="flex flex-col gap-y-5 xl:gap-y-[26px]"
      >
        {includedInCost.map((item, idx) => (
          <ListItem key={idx} item={item} />
        ))}
      </AnimatedWrapper>
    </div>
  );
}
