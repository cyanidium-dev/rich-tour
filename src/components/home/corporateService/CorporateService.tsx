import Link from "next/link";
import Image from "next/image";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import MainButton from "@/components/shared/buttons/MainButton";
import Container from "@/components/shared/container/Container";
import AnimatedArrow from "./AnimatedArrow";

export default function CorporateService() {
  return (
    <section className="mb-[148px] xl:mb-[180px] text-white">
      <Container>
        <AnimatedWrapper
          animation={fadeInAnimation({ y: 30 })}
          className="relative rounded-[12px] overflow-hidden"
        >
          <Image
            src="/images/home/corporate/corporateBg.webp"
            alt="background"
            width={2240}
            height={966}
            className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
          />
          <AnimatedArrow />
          <div className="relative z-10 px-7 py-10 xl:pt-14 xl:pb-7">
            <AnimatedWrapper
              as="h2"
              animation={fadeInAnimation({ x: 30, delay: 0.4 })}
              className="mb-1 text-16reg xl:text-24reg text-center"
            >
              Корпоративне обслуговування
            </AnimatedWrapper>
            <AnimatedWrapper
              as="p"
              animation={fadeInAnimation({ x: -30, delay: 0.4 })}
              className="max-w-[514px] xl:max-w-[867px] mb-8 xl:mb-7 mx-auto text-32med xl:text-48med text-center"
            >
              Ваша поїздка — наша турбота!
            </AnimatedWrapper>
            <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.8 })}>
              <Link href="/corporate">
                <MainButton
                  variant="white"
                  className="w-[203px] h-12 mx-auto mb-[118px] xl:mb-[171px] text-14med"
                >
                  Переглянути
                </MainButton>
              </Link>
            </AnimatedWrapper>
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30, delay: 1.2 })}
              as="p"
              className="max-w-[545px] mx-auto text-14reg xl:text-16reg text-center"
            >
              Rich Tour пропонує професійні рішення для корпоративних клієнтів.
              Ми знаємо, як важливо забезпечити комфорт, ефективність та
              бездоганну організацію для вашого бізнесу.
            </AnimatedWrapper>
          </div>
        </AnimatedWrapper>
      </Container>
    </section>
  );
}
