import Image from "next/image";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import AnimatedArrow from "./AnimatedArrow";

export default function Hero() {
  return (
    <section className="relative mb-[148px] xl:mb-[180px]">
      <Image
        src="/images/dashboard/hero/bgImage.webp"
        alt="background"
        fill
        priority
        sizes="100vw"
        className="hidden sm:block absolute top-0 left-0 -z-20 object-cover object-right"
      />
      <Image
        src="/images/dashboard/hero/bgImageMob.webp"
        alt="background"
        fill
        priority
        sizes="100vw"
        className="sm:hidden absolute top-0 left-0 -z-20 object-cover"
      />
      <Container className="relative pt-[151px] xl:pt-[193px] pb-[59px] xl:pb-[131px]">
        <AnimatedArrow />
        <AnimatedWrapper
          as="h1"
          animation={fadeInAnimation({ x: -30 })}
          className="mb-[262px] xl:mb-10 text-32med xl:text-48med text-white uppercase text-center"
        >
          Кабінет агента
        </AnimatedWrapper>
        <AnimatedWrapper
          as="p"
          animation={fadeInAnimation({ x: 30, delay: 0.4 })}
          className="max-w-[329px] lg:max-w-[526px] mx-auto text-white text-center"
        >
          Шановні партнери, тут вказана коротка інформація про наші тури та Вашу
          комісію. Обирайте тур, який зацікавив Вас та Ваших клієнтів, щоб
          детальніше ознайомитись з описом і програмою туру. Вдалих продажів!
        </AnimatedWrapper>
      </Container>
    </section>
  );
}
