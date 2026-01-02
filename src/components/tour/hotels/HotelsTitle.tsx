import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

export default function HotelsTitle() {
  return (
    <div className="relative flex">
      <AnimatedWrapper
        as="h2"
        animation={fadeInAnimation({ x: -30 })}
        className="mb-10 xl:mb-[72px] text-24med xl:text-40med text-black"
      >
          Інформація про готелі
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ x: 30 })}
        className="flex absolute top-[6px] xl:top-5 left-[220px] xl:left-[530px] w-screen text-black"
      >
        <ArrowHeadIcon />
        <div className="absolute w-full h-[3px] top-[9.5px] left-[2px] bg-black"></div>
      </AnimatedWrapper>
    </div>
  );
}
