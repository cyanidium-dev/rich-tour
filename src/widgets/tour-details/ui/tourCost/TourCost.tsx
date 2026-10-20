import Image from "next/image";
import { Tour } from "@/entities/tour/index";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Calendar from "./Calendar";
import { Container } from "@/shared/ui/index";
import AnimatedArrowDesk from "./AnimatedArrowDesk";

interface TourCostProps {
  isLogin: boolean;
  tour: Tour;
  companyName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  preview?: boolean;
  missingDate?: boolean;
}

export default function TourCost({
  isLogin,
  tour,
  preview = false,
  missingDate = false,
  ...userData
}: TourCostProps) {
  const { costImages } = tour;
  const tallImage = isLogin ? undefined : costImages.tall;

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container
        className={`md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] ${tallImage ? "lg:grid-cols-3" : ""} items-stretch gap-x-5 xl:gap-x-10`}
      >
        <div className="hidden md:flex flex-col justify-between min-w-0">
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
            Можете переглянути вільні дати для цього тура та обрати підходящий формат для себе
          </AnimatedWrapper>
          {costImages.short && (
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30, delay: 0.8 })}
              className="relative h-[544px] rounded-[12px] overflow-hidden"
            >
              <Image
                src={costImages.short.url}
                alt={costImages.short.alt}
                fill
                sizes="30vw"
                className="object-cover"
              />
            </AnimatedWrapper>
          )}
        </div>
        {preview && missingDate ? (
          <div className="rounded-[28px] border border-black p-8 text-center">
            Дату виїзду ще не додано
          </div>
        ) : (
          <Calendar isLogin={isLogin} tour={tour} preview={preview} {...userData} />
        )}
        {tallImage && (
          <div className="hidden lg:block relative min-w-0 h-[702px]">
            <AnimatedArrowDesk />
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30, delay: 0.4 })}
              viewport={{ once: true, amount: 0.4 }}
              className="relative h-[702px] rounded-[12px] overflow-hidden"
            >
              <Image
                src={tallImage.url}
                alt={tallImage.alt}
                fill
                sizes="30vw"
                className="object-cover"
              />
            </AnimatedWrapper>
          </div>
        )}
      </Container>
    </section>
  );
}
