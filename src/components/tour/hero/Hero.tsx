import Image from "next/image";
import { getDayWord } from "@/utils/getDayWord";
import { Tour } from "@/types/tour";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import MainButton from "@/components/shared/buttons/MainButton";
import Container from "@/components/shared/container/Container";
import BookingWithButton from "../../shared/booking/BookingWithButton";

interface HeroProps {
  tour: Tour;
}

export default function Hero({ tour }: HeroProps) {
  const { title, duration, images, program } = tour;

  return (
    <section className="mb-[148px] xl:mb-[180px] pt-6 xl:pt-[18px]">
      <Container>
        <div className="flex flex-col md:flex-row md:justify-between md:items-stretch gap-y-8 gap-x-5">
          <div className="flex flex-col justify-between md:w-[40.6%]">
            <div>
              <AnimatedWrapper
                as="h1"
                animation={fadeInAnimation({ y: 30 })}
                className="mb-[9px] xl:mb-[18px] text-24bold xl:text-40bold"
              >
                {title}
              </AnimatedWrapper>
              <AnimatedWrapper
                as="p"
                animation={fadeInAnimation({ y: 30 })}
                className="mb-8 text-16semi xl:text-20semi"
              >
                {duration}&nbsp;{getDayWord(duration)}
              </AnimatedWrapper>
            </div>
            <div className="flex flex-col lg:flex-row gap-2 md:mb-6">
              <BookingWithButton
                tourName={title}
                buttonStyles="w-full lg:w-[198px] h-12 text-14med"
              />
              <AnimatedWrapper
                animation={fadeInAnimation({ y: 30, delay: 0.4 })}
              >
                <a
                  href={program?.url || ""}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <MainButton
                    variant="ghost black"
                    className="w-full lg:w-[249px] h-12 text-14med"
                  >
                    Завантажити програму туру
                  </MainButton>
                </a>
              </AnimatedWrapper>
            </div>
          </div>
          <AnimatedWrapper
            animation={fadeInAnimation({ x: 30, delay: 0.4 })}
            className="relative w-full md:w-[57.6%] h-[184px] md:h-auto md:flex-1 rounded-[12px] overflow-hidden"
          >
            <Image
              src={images[0]?.url || ""}
              alt={images[0]?.alt || ""}
              fill
              sizes="100vw"
              className="w-full h-full object-cover"
            />
          </AnimatedWrapper>
        </div>
        <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-5 mt-4 md:mt-5">
          <AnimatedWrapper
            animation={fadeInAnimation({ x: -30, delay: 0.8 })}
            className="relative w-full  md:w-[40.6%] h-[184px] md:h-[244px] rounded-[12px] overflow-hidden"
          >
            <Image
              src={images[1]?.url || ""}
              alt={images[1]?.alt || ""}
              fill
              sizes="100vw"
              className="w-full h-full object-cover"
            />
          </AnimatedWrapper>
          <AnimatedWrapper
            animation={fadeInAnimation({ x: 30, delay: 0.8 })}
            className="relative w-full md:w-[57.6%] h-[184px] md:h-[244px] rounded-[12px] overflow-hidden"
          >
            {" "}
            <Image
              src={images[2]?.url || ""}
              alt={images[2]?.alt || ""}
              fill
              sizes="100vw"
              className="w-full h-full object-cover"
            />
          </AnimatedWrapper>
        </div>
      </Container>
    </section>
  );
}
