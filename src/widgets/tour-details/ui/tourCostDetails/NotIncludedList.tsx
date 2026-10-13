import { fadeInAnimation, listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import ListItem from "./ListItem";

interface NotIncludedListProps {
  notIncludedInCost: string[];
  fullWidth: boolean;
}

export default function NotIncludedList({ notIncludedInCost, fullWidth }: NotIncludedListProps) {
  if (!notIncludedInCost || !notIncludedInCost.length) return null;

  return (
    <div className={fullWidth ? "w-full" : "md:w-1/2 md:pl-10 xl:pl-[102px]"}>
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
        className={
          fullWidth
            ? "grid grid-cols-1 gap-y-5 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 xl:gap-y-[26px]"
            : "flex flex-col gap-y-5 xl:gap-y-[26px]"
        }
      >
        {notIncludedInCost.map((item, idx) => (
          <ListItem key={idx} item={item} />
        ))}
      </AnimatedWrapper>
    </div>
  );
}
