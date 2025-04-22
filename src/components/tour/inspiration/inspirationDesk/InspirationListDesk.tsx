import Image from "next/image";
import { InspirationItem } from "@/types/tour";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";
import AnimatedArrowOneDesk from "./AnimatedArrowOneDesk";
import AnimatedArrowTwoDesk from "./AnimatedArrowTwoDesk";
import AnimatedArrowThreeDesk from "./AnimatedArrowThreeDesk";

interface InspirationListDeskProps {
  inspiration: InspirationItem[];
}

export default function InspirationListDesk({
  inspiration,
}: InspirationListDeskProps) {
  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="hidden lg:flex h-[554px] mb-[42px] xl:mb-16 text-white text-12semi xl:text-14semi"
    >
      {/* Перший стовпчик */}
      <AnimatedListItem className="w-[14.29%]">
        <div className="relative h-[422px]">
          <AnimatedArrowOneDesk />
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
        <p className="flex items-end h-[132px] py-8 px-4 xl:px-5 bg-black">
          {inspiration[0]?.text}
        </p>
      </AnimatedListItem>
      {/* Другий стовпчик */}
      <AnimatedListItem className="w-[14.29%] py-8 px-4 xl:px-7 bg-main">
        {inspiration[1]?.text}
      </AnimatedListItem>
      {/* Третій стовпчик */}
      <AnimatedListItem className="w-[14.29%]">
        <div className="relative h-[220px]">
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
        <p className="flex items-end h-[115px] py-8 px-4 xl:px-7 bg-black">
          {inspiration[2]?.text}
        </p>
        <div className="relative h-[219px]">
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
      </AnimatedListItem>
      {/* Четвертий стовпчик */}
      <AnimatedListItem className="relative flex items-end w-[14.29%] py-8 px-4 xl:px-7 bg-main">
        <AnimatedArrowTwoDesk />
        {inspiration[3]?.text}
      </AnimatedListItem>
      {/* П'ятий стовпчик */}
      <AnimatedListItem className="w-[14.29%]">
        <div className="relative h-[115px] py-8 px-4 xl:px-6 bg-black">
          <p className="max-w-[96%]">{inspiration[4]?.text}</p>
        </div>
        <div className="relative h-[439px]">
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
      </AnimatedListItem>
      {/* Шостий стовпчик */}
      <AnimatedListItem className="relative flex items-center w-[14.29%] py-8 px-4 xl:px-7 bg-main">
        <AnimatedArrowThreeDesk />
        {inspiration[5]?.text}
      </AnimatedListItem>
      {/* Сьомийй стовпчик */}
      <AnimatedListItem className="w-[14.29%]">
        <div className="relative h-[433px]">
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
        <p className="flex items-end h-[121px] py-8 px-4 xl:px-7 bg-black">
          {inspiration[6]?.text}
        </p>
      </AnimatedListItem>
    </AnimatedWrapper>
  );
}
