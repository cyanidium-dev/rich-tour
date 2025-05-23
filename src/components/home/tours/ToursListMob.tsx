import Image from "next/image";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

export default function ToursListMob() {
  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="flex md:hidden flex-col gap-5 text-white text-28med"
    >
      <AnimatedListItem className="flex items-end relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgFirstMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <p className="max-w-[162px]">Тури Європою</p>
        <div className="absolute -z-10 bottom-[-190px] left-[-92px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
      </AnimatedListItem>
      <AnimatedListItem className="flex items-end justify-end relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgSecondMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
        />
        <p className="max-w-[164px] text-right">Під заказні групи</p>
      </AnimatedListItem>
      <AnimatedListItem className="relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgThirdMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
        />
        <p className="max-w-[143px]">Львів для дітей</p>
      </AnimatedListItem>
      <AnimatedListItem className="relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgFourthMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
        />
        <p className="max-w-[143px]">Морські тури</p>
        <div className="absolute -z-10 top-[-186px] left-[-110px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
      </AnimatedListItem>
      <AnimatedListItem className="flex items-end relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgFifthMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
        />
        <p className="max-w-[261px]">Різдвяні ярмарки Європи</p>
      </AnimatedListItem>
    </AnimatedWrapper>
  );
}
