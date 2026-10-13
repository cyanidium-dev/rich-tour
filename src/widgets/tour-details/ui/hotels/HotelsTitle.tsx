import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

export default function HotelsTitle({ listMode = false }: { listMode?: boolean }) {
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
        className={`absolute top-[6px] w-screen text-black xl:top-5 xl:left-[530px] ${listMode ? "hidden md:left-[350px] md:flex" : "left-[220px] flex"}`}
      >
        <ArrowHeadIcon />
        <div className="absolute w-full h-[3px] top-[9.5px] left-[2px] bg-black"></div>
      </AnimatedWrapper>
    </div>
  );
}
