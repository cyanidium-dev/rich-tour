import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import MainButton from "@/components/shared/buttons/MainButton";
import BenefitsList from "./BenefitsList";

export default function Telegram() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="flex flex-col lg:flex-row gap-y-12 justify-between">
        <div className="lg:w-[33.9%]">
          <AnimatedWrapper
            animation={fadeInAnimation({ y: 30 })}
            as="h2"
            className="mb-5 xl:mb-7 text-32med xl:text-48med text-center lg:text-left"
          >
            Наш телеграм канал для вас!
          </AnimatedWrapper>
          <AnimatedWrapper
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            as="p"
            className="mb-8 text-center lg:text-left"
          >
            Ми створили телеграм канал для туристичних агентів з нашими
            актуальними пропозиціями. Запрошуємо.
          </AnimatedWrapper>
          <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.8 })}>
            <a href="" target="_blank" rel="noopener noreferrer nofollow">
              <MainButton className="w-full max-w-[550px] h-14 mx-auto lg:mx-0 text-14med">
                Доєднатися до телеграм каналу
              </MainButton>
            </a>
          </AnimatedWrapper>
        </div>
        <BenefitsList />
      </Container>
    </section>
  );
}
