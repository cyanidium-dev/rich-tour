import { Tour } from "@/types/tour";
import {
  fadeInAnimation,
  listVariants,
} from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import PointItem from "./PointItem";
import Image from "next/image";
import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";

interface PointsProps {
  tour: Tour;
}

export default function Points({ tour }: PointsProps) {
  const { points } = tour;

  if (!points || !points.length) return null;

  return (
    <section className="mb-[74px] xl:mb-[145px]">
      <Container>
        <div className="relative flex flex-col xl:flex-row gap-y-7 xl:gap-x-[46px] items-center xl:items-start pb-[60px] xl:pb-0 xl:pt-2">
          <AnimatedWrapper
            animation={fadeInAnimation({ delay: 0.8, duration: 0.4 })}
            className="absolute top-0 xl:top-[calc(50%+16px)] left-[calc(50%-1px)] xl:left-[4px] -z-10 w-[2px] xl:w-[calc(100%-4px)] h-full xl:h-[2px] bg-gradient-to-b xl:bg-gradient-to-r from-main to-black"
          >
            <ArrowHeadIcon className="absolute bottom-[-6.5px] xl:bottom-[-6px] left-[-6px] xl:left-auto xl:right-[-5px] -rotate-90 xl:rotate-180 h-4 text-black" />
          </AnimatedWrapper>
          <AnimatedWrapper
            animation={fadeInAnimation({ x: -30 })}
            className="xl:mt-2"
          >
            <Image
              src="/images/tour/points/bus.svg"
              alt="bus"
              width="290"
              height="99"
            />
          </AnimatedWrapper>
          <AnimatedWrapper
            as="ul"
            animation={listVariants({
              staggerChildren: 0.5,
              delayChildren: 0.4,
            })}
            className="flex flex-col xl:flex-row items-center gap-y-[90px] xl:gap-x-[49px]"
          >
            {points.map((point, idx) => (
              <PointItem key={idx} point={point} />
            ))}
          </AnimatedWrapper>
        </div>
      </Container>
    </section>
  );
}
