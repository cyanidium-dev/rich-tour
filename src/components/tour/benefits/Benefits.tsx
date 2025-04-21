import Image from "next/image";
import { Tour } from "@/types/tour";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import BenefitsList from "./BenefitsList";
import AnimatedArrowMob from "./AnimatedArrowMob";
import AnimatedArrowDesk from "./AnimatedArrowDesk";

interface BenefitsProps {
  tour: Tour;
}

export default function Benefits({ tour }: BenefitsProps) {
  const { benefits } = tour;

  if (!benefits) return null;

  const { image, list } = benefits;

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="relative flex flex-col gap-y-10 md:flex-row-reverse md:gap-x-8 xl:gap-x-16">
        <AnimatedArrowMob />
        <AnimatedArrowDesk />
        <div className="md:w-[40.8%] md:py-[22px]">
          <AnimatedWrapper
            as="h2"
            animation={fadeInAnimation({ y: 30 })}
            className="mb-5 xl:mb-8 text-24med xl:text-40med"
          >
            Переваги туру:
          </AnimatedWrapper>
          <BenefitsList list={list} />
        </div>
        <AnimatedWrapper
          animation={fadeInAnimation({ y: 30, delay: 0.4 })}
          className="relative w-full md:w-[48.4%] h-[234px] md:h-auto md:flex-1 rounded-[12px] overflow-hidden"
        >
          <Image
            src={image?.url || ""}
            alt={image?.alt || ""}
            fill
            className="object-cover"
          />
        </AnimatedWrapper>
      </Container>
    </section>
  );
}
