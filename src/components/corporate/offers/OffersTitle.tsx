import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";

export default function OffersTitle() {
  return (
    <div className="mb-16 xl:mb-[43px] flex justify-center items-center gap-x-7 xl:gap-x-12 w-screen">
      <AnimatedWrapper
        animation={fadeInAnimation({ x: -30, delay: 0.4 })}
        className="relative w-[calc(50%-142px)] xl:w-[calc(50%-267px)] h-[3px] bg-black"
      >
        <ArrowHeadIcon className="absolute top-[-10px] right-[-4px] rotate-180" />
      </AnimatedWrapper>
      <AnimatedWrapper
        as="h2"
        animation={fadeInAnimation({ y: 30 })}
        className="max-w-[228px] xl:max-w-[438px] text-32med xl:text-40med text-center"
      >
        Що ми пропонуємо?
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ x: 30, delay: 0.4 })}
        className="relative w-[calc(50%-142px)] xl:w-[calc(50%-267px)] h-[3px] bg-black"
      >
        <ArrowHeadIcon className="absolute top-[-10px] left-[-4px]" />
      </AnimatedWrapper>
    </div>
  );
}
