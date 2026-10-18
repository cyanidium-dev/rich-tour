import Image from "next/image";
import { getDayWord } from "@/shared/lib/index";
import { Tour } from "@/entities/tour/index";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { MainButton } from "@/shared/ui/index";
import { Container } from "@/shared/ui/index";
import BookingWithButton from "../../../../components/shared/booking/BookingWithButton";

interface HeroProps {
  tour: Tour;
  companyName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
}

export default function Hero({ tour, ...userData }: HeroProps) {
  const { title, duration, heroImages, programUpload } = tour;
  const hasLowerImages = Boolean(heroImages.left || heroImages.right);

  return (
    <section className="mb-[148px] xl:mb-[180px] pt-6 xl:pt-[18px]">
      <Container>
        <div className="flex flex-col md:flex-row md:justify-between md:items-stretch gap-y-8 gap-x-5">
          <div
            className={`flex flex-col justify-between ${heroImages.main ? "md:w-[40.6%]" : "w-full"}`}
          >
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
            <div className="flex flex-col xl:flex-row gap-2 md:mb-6">
              <BookingWithButton
                {...userData}
                tour={tour}
                buttonStyles="w-full xl:w-[198px] h-12 text-14med"
              />
              <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.4 })}>
                <a
                  href={programUpload?.url || ""}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <MainButton variant="ghost black" className="w-full xl:w-[249px] h-12 text-14med">
                    Завантажити програму туру
                  </MainButton>
                </a>
              </AnimatedWrapper>
            </div>
          </div>
          {heroImages.main && (
            <AnimatedWrapper
              animation={fadeInAnimation({ x: 30, delay: 0.4 })}
              className="relative w-full md:w-[57.6%] h-[184px] md:h-auto md:flex-1 rounded-[12px] overflow-hidden"
            >
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={heroImages.main.mobileUrl || heroImages.main.url}
                />
                <Image
                  src={heroImages.main.url}
                  alt={heroImages.main.alt}
                  fill
                  sizes="100vw"
                  className="w-full h-full object-cover"
                />
              </picture>
            </AnimatedWrapper>
          )}
        </div>
        {hasLowerImages && (
          <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-5 mt-4 md:mt-5">
            {heroImages.left && (
              <AnimatedWrapper
                animation={fadeInAnimation({ x: -30, delay: 0.8 })}
                className={`relative w-full ${heroImages.right ? "md:w-[40.6%]" : "md:w-full"} h-[184px] md:h-[244px] rounded-[12px] overflow-hidden`}
              >
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet={heroImages.left.mobileUrl || heroImages.left.url}
                  />
                  <Image
                    src={heroImages.left.url}
                    alt={heroImages.left.alt}
                    fill
                    sizes="100vw"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </AnimatedWrapper>
            )}
            {heroImages.right && (
              <AnimatedWrapper
                animation={fadeInAnimation({ x: 30, delay: 0.8 })}
                className={`relative w-full ${heroImages.left ? "md:w-[57.6%]" : "md:w-full"} h-[184px] md:h-[244px] rounded-[12px] overflow-hidden`}
              >
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet={heroImages.right.mobileUrl || heroImages.right.url}
                  />
                  <Image
                    src={heroImages.right.url}
                    alt={heroImages.right.alt}
                    fill
                    sizes="100vw"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </AnimatedWrapper>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
