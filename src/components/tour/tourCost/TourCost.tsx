import Image from "next/image";
import { Tour } from "@/types/tour";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Calendar from "./Calendar";
import Container from "@/components/shared/container/Container";
import AnimatedArrowDesk from "./AnimatedArrowDesk";

interface TourCostProps {
  tour: Tour;
}

export default function TourCost({ tour }: TourCostProps) {
  const { images } = tour;

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="md:flex items-stretch gap-x-5 xl:gap-x-10">
        <div className="hidden md:flex flex-col flex-1 justify-between xl:w-[calc(33.3%-26.67px)]">
          <AnimatedWrapper
            as="h2"
            animation={fadeInAnimation({ y: 30 })}
            className="mb-5 text-40med"
          >
            Вартість туру
          </AnimatedWrapper>
          <AnimatedWrapper
            as="p"
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            className="mb-[30px] text-16reg"
          >
            Можете переглянути вільні дати для цього тура та обрати підходящий
            формат для себе
          </AnimatedWrapper>
          {images[3] ? (
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30, delay: 0.8 })}
              className="relative h-[544px] rounded-[12px] overflow-hidden"
            >
              <Image
                src={images[3].url}
                alt={images[3].alt}
                fill
                sizes="30vw"
                className="object-cover"
              />
            </AnimatedWrapper>
          ) : null}
        </div>
        <Calendar tour={tour} />
        {images[4] ? (
          <div className="hidden lg:block relative xl:w-[calc(33.3%-26.67px)] h-[702px]">
            <AnimatedArrowDesk />
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30, delay: 0.4 })}
              viewport={{ once: true, amount: 0.4 }}
              className="relative h-[702px] rounded-[12px] overflow-hidden"
            >
              <Image
                src={images[4].url}
                alt={images[4].alt}
                fill
                sizes="30vw"
                className="object-cover"
              />
            </AnimatedWrapper>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
