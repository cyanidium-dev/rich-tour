import Image from "next/image";
import Container from "@/components/shared/container/Container";

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
        <h1 className="mb-[255px] xl:mb-[212px] text-40med xl:text-48med uppercase text-center">
          Про нас
        </h1>
        <p className="max-w-[283px] sm:max-w-[430px] mx-auto text-14reg xl:text-16reg text-center">
          Ласкаво просимо до нашого туристичного оператора! Ми спеціалізуємося
          на розробці та реалізації автобусних турів, створюючи унікальні
          подорожі, які запам&apos;ятаються вам на все життя.
        </p>
        <Image
          src="/images/about/hero/arrowMob.svg"
          alt="arrow"
          priority
          width="147"
          height="202"
          className="lg:hidden absolute top-[223px] left-[calc(50%-72px)]"
        />
        <Image
          src="/images/about/hero/arrowDesk.svg"
          alt="arrow"
          priority
          width="240"
          height="224"
          className="hidden lg:block absolute top-[120px] xl:top-[156px] left-[calc(50%-328px)] xl:left-[calc(50%-368px)]"
        />
      </Container>
    </section>
  );
}
