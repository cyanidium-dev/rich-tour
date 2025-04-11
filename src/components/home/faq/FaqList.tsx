import { faqList } from "./mockedData";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import FaqItem from "./FaqItem";

export default function FaqList() {
  if (!faqList || !faqList.length) {
    return null;
  }

  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="flex flex-col gap-y-4 xl:gap-y-5"
    >
      {faqList.map((faqItem, idx) => (
        <FaqItem key={idx} faqItem={faqItem} />
      ))}
    </AnimatedWrapper>
  );
}
