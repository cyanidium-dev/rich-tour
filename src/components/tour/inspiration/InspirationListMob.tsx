import Image from "next/image";
import { InspirationItem } from "@/types/tour";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedArrowOneMob from "./AnimatedArrowOneMob";
import AnimatedArrowTwoMob from "./AnimatedArrowTwoMob";
import AnimatedArrowThreeMob from "./AnimatedArrowThreeMob";

interface InspirationListMobProps {
  inspiration: InspirationItem[];
}

export default function InspirationListMob({
  inspiration,
}: InspirationListMobProps) {
  if (!inspiration || !inspiration.length) return null;

  return (
    <div className="mb-[42px] xl:mb-16 text-white text-14semi">
      {/* Перший рядок */}
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="flex items-center justify-center"
      >
        <div className="relative w-1/2 h-[422px]">
          <div className="absolute inset-0 z-10 bg-inspiration"></div>
          {inspiration[0]?.images?.[0] && (
            <Image
              src={inspiration[0].images[0].url}
              alt={inspiration[0].images[0].alt || "Tour image"}
              fill
              className="object-cover object-left"
            />
          )}
        </div>
        <div className="relative w-1/2 h-[422px]">
          <AnimatedArrowOneMob />
          <p className="h-[296px] p-[26px] bg-main">{inspiration[1]?.text}</p>
          <p className="flex items-end h-[126px] p-[26px] bg-black">
            {inspiration[0]?.text}
          </p>
        </div>
      </AnimatedWrapper>
      {/* Другий рядок */}
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="flex items-center justify-center"
      >
        <div className="relative flex items-end w-1/2 h-[366px] p-[26px] bg-black">
          {inspiration[2]?.text}
          <AnimatedArrowTwoMob />
        </div>
        <div className="w-1/2 h-[366px]">
          <div className="relative h-[187px]">
            <div className="absolute inset-0 z-10 bg-inspiration"></div>
            {inspiration[2]?.images?.[1] && (
              <Image
                src={inspiration[2].images[1].url}
                alt={inspiration[2].images[1].alt || "Tour image"}
                fill
                className="object-cover object-left"
              />
            )}
          </div>
          <div className="relative h-[179px]">
            <div className="absolute inset-0 z-10 bg-inspiration"></div>
            {inspiration[2]?.images?.[0] && (
              <Image
                src={inspiration[2].images[0].url}
                alt={inspiration[2].images[0].alt || "Tour image"}
                fill
                className="object-cover object-left"
              />
            )}
          </div>
        </div>
      </AnimatedWrapper>
      {/* Третій рядок */}
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="flex items-center justify-center"
      >
        <div className="relative w-1/2 h-[268px]">
          <div className="absolute inset-0 z-10 bg-inspiration"></div>
          {inspiration[4]?.images?.[0] && (
            <Image
              src={inspiration[4].images[0].url}
              alt={inspiration[4].images[0].alt || "Tour image"}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex items-end w-1/2 h-[268px] bg-main p-[26px]">
          {inspiration[3]?.text}
        </div>
      </AnimatedWrapper>
      {/* Четвертий рядок */}
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="flex items-end h-[133px] p-[26px] bg-black"
      >
        <p className="max-w-[129px]">{inspiration[4]?.text}</p>
      </AnimatedWrapper>
      {/* П'ятий рядок */}
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="flex items-center justify-center"
      >
        <div className="flex items-end w-1/2 h-[244px] p-[26px] bg-main">
          {inspiration[5]?.text}
        </div>
        <div className="relative w-1/2 h-[244px]">
          <AnimatedArrowThreeMob />
          <div className="absolute inset-0 z-10 bg-inspiration"></div>
          {inspiration[6]?.images?.[0] && (
            <Image
              src={inspiration[6].images[0].url}
              alt={inspiration[6].images[0].alt || "Tour image"}
              fill
              className="object-cover"
            />
          )}
        </div>
      </AnimatedWrapper>
      {/* Шостий рядок */}
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="flex items-end justify-end h-[133px] p-[26px] bg-black text-right"
      >
        <p className="max-w-[193px]">{inspiration[6]?.text}</p>
      </AnimatedWrapper>
    </div>
  );
}
