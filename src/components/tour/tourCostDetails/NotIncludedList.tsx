import {
  fadeInAnimation,
  listVariants,
} from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import ListItem from "./ListItem";

interface NotIncludedListProps {
  notIncludedInCost: string[];
}

export default function NotIncludedList({
  notIncludedInCost,
}: NotIncludedListProps) {
  if (!notIncludedInCost || !notIncludedInCost.length) return null;

  return (
    <div className="md:w-1/2 md:pl-10 xl:pl-[102px]">
      <AnimatedWrapper
        as="h2"
        animation={fadeInAnimation({ y: 30 })}
        className="mb-7 xl:mb-8 text-24med xl:text-32med"
      >
        У вартість туру <span className="text-main">НЕ</span> включено
      </AnimatedWrapper>
      <AnimatedWrapper
        as="ul"
        animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
        className="flex flex-col gap-y-5 xl:gap-y-[26px]"
      >
        {notIncludedInCost.map((item, idx) => (
          <ListItem key={idx} item={item} />
        ))}
      </AnimatedWrapper>
    </div>
  );
}
