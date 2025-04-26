// import { faqList } from "./mockedData";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import FaqItem from "./FaqItem";

//@ts-expect-error
export default function FaqList({items}) {
  if (!items || !items.length) {
    return null;
  }

  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="flex flex-col gap-y-4 xl:gap-y-5"
    >
      {/*@ts-expect-error*/}
      {items.map((faqItem, idx) => (
        <FaqItem key={idx} faqItem={faqItem} />
      ))}
    </AnimatedWrapper>
  );
}
