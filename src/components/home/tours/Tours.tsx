import Image from "next/image";
import {
  fadeInAnimation,
  listVariants,
} from "@/components/shared/animation/animationVariants";
import Container from "@/components/shared/container/Container";
import ToursListMob from "./ToursListMob";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedArrowMob from "./AnimatedArrowMob";
import AnimatedArrowDesk from "./AnimatedArrowDesk";

export default function Tours() {
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
              <div className="flex items-end relative aspect-[360/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
                <Image
                  src="/images/home/tours/bgFirstDesk.webp"
                  alt="background"
                  width={720}
                  height={356}
                  className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
                />
                <p className="max-w-[46.2%] text-20med lg:text-28med">
                  Тури Європою
                </p>
                <div className="absolute -z-10  bottom-[-230px] left-[-142px] lg:bottom-[-190px] lg:left-[-92px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
              </div>
              <div className="flex items-end justify-end relative aspect-[360/201] px-[18px] py-5 rounded-[12px] overflow-hidden">
                <Image
                  src="/images/home/tours/bgSecondDesk.webp"
                  alt="background"
                  width={720}
                  height={402}
                  className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
                />
                <p className="max-w-[76.2%] text-right text-20med lg:text-28med">
                  Під заказні групи
                </p>
              </div>
            </AnimatedWrapper>
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30, delay: 0.8 })}
              className="relative  md:w-[calc(50%-10px)] aspect-[360/399] px-[18px] py-5 rounded-[12px] overflow-hidden"
            >
              <Image
                src="/images/home/tours/bgThirdDesk.webp"
                alt="background"
                width={720}
                height={798}
                className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
              />
              <p className="max-w-[69.2%] xl:max-w-[203px] text-20med lg:text-28med">
                Львів для дітей
              </p>
            </AnimatedWrapper>
          </AnimatedWrapper>
        </div>
        <AnimatedWrapper
          animation={fadeInAnimation({ y: 30, delay: 1.2 })}
          className="hidden md:flex flex-col gap-y-5 w-[calc(33.3%-13.3px)] text-white"
        >
          <div className="relative flex items-end aspect-[360/399] px-[18px] py-5 rounded-[12px] overflow-hidden">
            <Image
              src="/images/home/tours/bgFourthDesk.webp"
              alt="background"
              width={720}
              height={798}
              className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
            />
            <p className="text-20med lg:text-28med">Різдвяні ярмарки Європи</p>
          </div>
          <div className="relative aspect-[360/165] px-[18px] py-5 rounded-[12px] overflow-hidden">
            <Image
              src="/images/home/tours/bgFifthDesk.webp"
              alt="background"
              width={720}
              height={330}
              className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
            />
            <p className="max-w-[62%] text-20med lg:text-28med">Морські тури</p>
            <div className="absolute -z-10 top-[-232px] left-[-150px] lg:top-[-212px] lg:left-[-110px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
          </div>
        </AnimatedWrapper>
        <ToursListMob />
      </Container>
    </section>
  );
}
