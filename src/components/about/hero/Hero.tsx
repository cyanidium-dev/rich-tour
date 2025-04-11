import Image from "next/image";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import AnimatedArrowMob from "./AnimatedArrowMob";
import AnimatedArrowDesk from "./AnimatedArrowDesk";

export default function Hero() {
  return (
    <section className="relative mb-[148px] xl:mb-[180px] overflow-hidden text-white">
      <Image
        src="/images/about/hero/bgImage.webp"
        alt="background"
        fill
        priority
        sizes="100vw"
        className="absolute top-0 left-0 -z-20 object-cover object-left"
      />
      <Container className="relative pt-[128px] xl:pt-[156px] pb-[46px] xl:pb-[73px]">
        <AnimatedWrapper
          as="h1"
          animation={fadeInAnimation({ x: -30 })}
          className="mb-[255px] xl:mb-[212px] text-40med xl:text-48med uppercase text-center"
        >
          Про нас
        </AnimatedWrapper>
        <AnimatedWrapper
          as="p"
          animation={fadeInAnimation({ x: 30, delay: 0.4 })}
          className="max-w-[283px] sm:max-w-[430px] mx-auto text-14reg xl:text-16reg text-center"
        >
          Ласкаво просимо до нашого туристичного оператора! Ми спеціалізуємося
          на розробці та реалізації автобусних турів, створюючи унікальні
          подорожі, які запам&apos;ятаються вам на все життя.
        </AnimatedWrapper>
        <AnimatedArrowMob />
        <AnimatedArrowDesk />
      </Container>
    </section>
  );
}
