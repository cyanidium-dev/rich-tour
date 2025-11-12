import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
// import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";
import ArrowReverseHeadIcon from "@/components/shared/icons/ArrowReverseHeadIcon";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

export default function ExcursionsTitle() {
  return (
    <div className="relative justify-end flex">
        <AnimatedWrapper
            animation={fadeInAnimation({ x: 30 })}
            className="flex justify-end absolute top-[6px] xl:top-5 right-[220px] xl:right-[376px] w-screen text-black"
        >
            <ArrowReverseHeadIcon />
            <div className="absolute w-full h-[3px] top-[9.5px] right-[2px] bg-black"></div>
        </AnimatedWrapper>
      <AnimatedWrapper
        as="h2"
        animation={fadeInAnimation({ x: -30 })}
        className="mb-10 xl:mb-[72px] text-24med xl:text-40med text-black"
      >
          Ціни по місяцях
      </AnimatedWrapper>

    </div>
  );
}
