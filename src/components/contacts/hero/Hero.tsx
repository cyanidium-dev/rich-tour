import Image from "next/image";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";

export default function Hero() {
  return (
    <section className="relative mb-[148px] xl:mb-[180px]">
      <Image
        src="/images/contacts/hero/bgImage.webp"
        alt="background"
        fill
        priority
        sizes="100vw"
        className="absolute top-0 left-0 -z-20 object-cover object-left"
      />
      <Container className="pt-[128px] xl:pt-[103px] pb-[46px] xl:pb-[95px] text-white">
        <AnimatedWrapper
          as="h1"
          animation={fadeInAnimation({ y: 30 })}
          className="mb-[272px] xl:mb-[243px] text-40med xl:text-48med uppercase text-center"
        >
          Контакти
        </AnimatedWrapper>
        <AnimatedWrapper
          as="p"
          animation={fadeInAnimation({ y: 30, delay: 0.4 })}
          className="max-w-[283px] md:max-w-[428px] mx-auto text-14reg xl:text-16reg text-center"
        >
          Ми завжди раді вам допомогти! Зв’яжіться з нами будь-яким зручним для
          вас способом, щоб отримати консультацію, забронювати подорож або
          організувати захід вашої мрії.
        </AnimatedWrapper>
      </Container>
    </section>
  );
}
