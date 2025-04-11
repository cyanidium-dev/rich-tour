import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";

export default function DocumentsTitle() {
  return (
    <div className="mb-[54px] xl:mb-12 flex justify-center items-center gap-x-5 md:gap-x-10 w-screen text-white">
      <AnimatedWrapper
        animation={fadeInAnimation({ x: -30, delay: 0.8 })}
        className="relative w-[calc(50%-42px)] md:w-[calc(50%-62px)] xl:w-[calc(50%-65px)] h-[3px] bg-white"
      >
        <ArrowHeadIcon className="absolute top-[-10px] right-[-4px] rotate-180" />
      </AnimatedWrapper>
      <AnimatedWrapper
        as="h2"
        animation={fadeInAnimation({ y: 30 })}
        className="text-36med xl:text-40med"
      >
        Документи
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ x: 30, delay: 0.8 })}
        className="relative w-[calc(50%-42px)] md:w-[calc(50%-62px)] xl:w-[calc(50%-65px)] h-[3px] bg-white"
      >
        <ArrowHeadIcon className="absolute top-[-10px] left-[-4px]" />
      </AnimatedWrapper>
    </div>
  );
}
