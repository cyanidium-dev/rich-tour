import Image from "next/image";
import Link from "next/link";

import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

//@ts-expect-error
export default function ToursListMob({categories}) {
  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="flex md:hidden flex-col gap-5 text-white text-28med"
    >
      {categories[0] && <AnimatedListItem>
        <Link href={`/tours?category=${categories[0].title}&page=1`} className="flex items-end relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
          <Image
            src={categories[0].image.asset.url}
            alt="background"
            width={650}
            height={356}
            className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
          />
          <p className="max-w-[162px] text-24med">{categories[0].title}</p>
          <div className="absolute -z-10 bottom-[-190px] left-[-92px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
        </Link>
      </AnimatedListItem>}
      {categories[1] && <AnimatedListItem>
        <Link href={`/tours?category=${categories[1].title}&page=1`} className="flex items-end justify-end relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
          <Image
              src={categories[1].image.asset.url}
              alt="background"
              width={650}
              height={356}
              className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
          />
          <p className="max-w-[164px] text-right text-24med">{categories[1].title}</p>
        </Link>
      </AnimatedListItem>}
      {categories[2] && <AnimatedListItem>
        <Link href={`/tours?category=${categories[2].title}&page=1`} className="block relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
          <Image
            src={categories[2].image.asset.url}
            alt="background"
            width={650}
            height={356}
            className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
          />
          <p className="max-w-[143px] text-24med">{categories[2].title}</p>
        </Link>
      </AnimatedListItem>}
      {categories[3] && <AnimatedListItem>
        <Link href={`/tours?category=${categories[3].title}&page=1`} className="block relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
          <Image
              src={categories[3].image.asset.url}
              alt="background"
              width={650}
              height={356}
              className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
          />
          <p className="max-w-[143px] text-24med">{categories[3].title}</p>
          <div className="absolute -z-10 top-[-186px] left-[-110px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
        </Link>
      </AnimatedListItem>}
      {categories[4] && <AnimatedListItem>
        <Link href={`/tours?category=${categories[4].title}&page=1`} className="flex items-end relative aspect-[325/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
          <Image
            src={categories[4].image.asset.url}
            alt="background"
            width={650}
            height={356}
            className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
          />
          <p className="max-w-[261px] text-24med">{categories[4].title}</p>
        </Link>
      </AnimatedListItem>}
    </AnimatedWrapper>
  );
}
