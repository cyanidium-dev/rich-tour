import Image from "next/image";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import Container from "@/components/shared/container/Container";
import Search from "./Search";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedArrow from "./AnimatedArrow";

export default function Hero() {
  return (
    <section className="relative mb-[148px] xl:mb-[180px] overflow-hidden">
      <Image
        src="/images/home/hero/bgImage.webp"
        alt="background"
        fill
        priority
        sizes="100vw"
        className="absolute top-0 left-0 -z-20 object-cover"
      />
      <Container className="relative pt-[35px] pb-[70px] xl:pt-[44px] xl:pb-[34px]">
        <AnimatedArrow />
        <AnimatedWrapper
          as="h1"
          animation={fadeInAnimation({ x: -30 })}
          className="max-w-[283px] md:max-w-[548px] mb-[110px] xl:mb-[89px] mx-auto text-14reg xl:text-16reg text-center text-white"
        >
          Ми підберемо для вас ідеальний тур: пляжний релакс, захоплюючі
          екскурсії, або яскраві пригоди. Плануйте подорож легко та комфортно
          разом із професіоналами.
        </AnimatedWrapper>
        <AnimatedWrapper
          as="p"
          animation={fadeInAnimation({ x: 30 })}
          className="max-w-[259px] md:max-w-[692px] mb-[70px] xl:mb-[88px] mx-auto text-32med xl:text-48med text-center uppercase text-white"
        >
          Відпочинок вашої мрії ближче, ніж здається
        </AnimatedWrapper>

        <Search />
      </Container>
    </section>
  );
}
