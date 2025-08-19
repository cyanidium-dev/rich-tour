import Image from "next/image";
import Link from "next/link";
import { connection } from 'next/server';

import {
  fadeInAnimation,
  listVariants,
} from "@/components/shared/animation/animationVariants";
import Container from "@/components/shared/container/Container";
import ToursListMob from "./ToursListMob";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedArrowMob from "./AnimatedArrowMob";
import AnimatedArrowDesk from "./AnimatedArrowDesk";

import client from "@/lib/sanity";
import {mainTourCategoriesQuery} from "@/lib/queries";

export const revalidate = false;

export default async function Tours() {
  await connection();
  const mainTourCategories = await client.fetch(mainTourCategoriesQuery);
  console.log(mainTourCategories);
  if (!mainTourCategories || !mainTourCategories?.length) {
    return null;
  }

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="relative md:flex gap-x-5">
        <AnimatedArrowDesk />
        <AnimatedArrowMob />
        <div className="md:flex flex-col justify-between mb-10 md:mb-0 md:w-[calc(66.7%+13.3px)] min-h-full">
          <div className="md:flex flex-row-reverse justify-between ">
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30 })}
              className="md:w-[calc(50%-10px)]"
            >
              <h2 className="mb-[14px] md:mb-[10px] text-36med xl:text-48med">
                Наші тури
              </h2>
              <p className="max-w-[198px] mb-[23px] md:mb-0 text-14med xl:text-16med">
                Мрієте про незабутню подорож?
              </p>
            </AnimatedWrapper>
            <AnimatedWrapper
              as="p"
              animation={fadeInAnimation({ y: 30 })}
              className="md:max-w-[265px] md:w-[calc(50%-10px)] lg:mt-[9px] md:text-12light lg:text-14light xl:text-16light"
            >
              Ми створили тури для кожного, хто прагне відкрити світ: від
              романтичних прогулянок до захопливих пригод. Обирайте напрямок та
              вирушайте в подорож мрії!
            </AnimatedWrapper>
          </div>
          <AnimatedWrapper
            as="ul"
            animation={listVariants({
              staggerChildren: 0.5,
              delayChildren: 0.8,
            })}
            className="hidden md:flex gap-x-5 text-white"
          >
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30, delay: 0.4 })}
              className="flex flex-col gap-y-5 md:w-[calc(50%-10px)]"
            >
              {mainTourCategories[0] &&
                  <Link href={`/tours?category=${mainTourCategories[0].title}&page=1`}>
                    <div
                        className="flex items-end relative aspect-[360/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
                      <Image
                          src={mainTourCategories[0].image.asset.url}
                          alt="background"
                          width={720}
                          height={356}
                          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
                      />
                      <p className="max-w-[62.2%] text-28med lg:text-28med">
                        {mainTourCategories[0].title}
                      </p>
                      <div
                          className="absolute -z-10  bottom-[-230px] left-[-142px] lg:bottom-[-190px] lg:left-[-92px] w-[360px] aspect-[1.15/1] bg-main rounded-full"/>
                    </div>
                  </Link>
              }
              {mainTourCategories[1] &&
                  <Link href={`/tours?category=${mainTourCategories[1].title}&page=1`}>
                  <div
                  className="flex items-end justify-end relative aspect-[360/201] px-[18px] py-5 rounded-[12px] overflow-hidden">
                <Image
                    src={mainTourCategories[1].image.asset.url}
                    alt="background"
                    width={720}
                    height={402}
                    className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
                />
                <p className="max-w-[76.2%] text-right text-20med lg:text-28med">
                  {mainTourCategories[1].title}
                </p>
                <div
                    className="absolute -z-10  bottom-[-230px] right-[-142px] lg:bottom-[-190px] lg:right-[-92px] w-[340px] aspect-[1.1/1] bg-main rounded-full"/>
                  </div></Link>}
            </AnimatedWrapper>
            {mainTourCategories[2] && <AnimatedWrapper
                animation={fadeInAnimation({y: 30, delay: 0.8})}
                className="relative  md:w-[calc(50%-10px)] aspect-[360/399] px-[18px] py-5 rounded-[12px] overflow-hidden"
            >
              <Link href={`/tours?category=${mainTourCategories[2].title}&page=1`}>
                <Image
                  src={mainTourCategories[2].image.asset.url}
                  alt="background"
                  width={720}
                  height={798}
                  className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
                />
                <p className="max-w-[69.2%] xl:max-w-[203px] text-20med lg:text-28med">
                  {mainTourCategories[2].title}
                </p>
              </Link>
            </AnimatedWrapper>}
          </AnimatedWrapper>
        </div>
        <AnimatedWrapper
          animation={fadeInAnimation({ y: 30, delay: 1.2 })}
          className="hidden md:flex flex-col gap-y-5 w-[calc(33.3%-13.3px)] text-white"
        >
          {mainTourCategories[3] && <Link href={`/tours?category=${mainTourCategories[3].title}&page=1`}>
              <div className="relative flex items-end aspect-[360/399] px-[18px] py-5 rounded-[12px] overflow-hidden">
            <Image
              src={mainTourCategories[3].image.asset.url}
              alt="background"
              width={720}
              height={798}
              className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
            />
            <p className="text-20med lg:text-28med">{mainTourCategories[3].title}</p>
              </div></Link>}
          {mainTourCategories[4] && <Link href={`/tours?category=${mainTourCategories[4].title}&page=1`}>
              <div className="relative aspect-[360/165] px-[18px] py-5 rounded-[12px] overflow-hidden">
            <Image
              src={mainTourCategories[4].image.asset.url}
              alt="background"
              width={720}
              height={330}
              className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
            />
            <p className="max-w-[62%] text-20med lg:text-28med">{mainTourCategories[4].title}</p>
            <div className="absolute -z-10 top-[-232px] left-[-150px] lg:top-[-212px] lg:left-[-110px] w-[380px] aspect-[1.15/1] bg-main rounded-full"></div>
              </div></Link>}
        </AnimatedWrapper>
        <ToursListMob categories={mainTourCategories} />
      </Container>
    </section>
  );
}
