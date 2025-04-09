import Image from "next/image";
import Container from "@/components/shared/container/Container";

export default function Hero() {
  return (
    <section className="relative mb-[148px] xl:mb-[180px] overflow-hidden">
      <Image
        src="/images/corporate/hero/bgImage.webp"
        alt="background"
        fill
        priority
        sizes="100vw"
        className="absolute top-0 left-0 -z-20 object-cover object-left"
      />
      <Container className="relative pt-[128px] pb-[46px] xl:pt-[74px] xl:pb-[75px] text-white">
        <h1 className="max-w-[334px] xl:max-w-[513px] mb-[192px] xl:mb-[233px] mx-auto text-32med xl:text-40med uppercase text-center">
          Корпоративне обслуговування
        </h1>
        <p className="max-w-[303px] md:max-w-[476px] mx-auto text-14reg xl:text-16reg text-center">
          Ваш бізнес заслуговує найкращих рішень, коли йдеться про подорожі.
          Наша команда професіоналів готова забезпечити повний спектр послуг для
          корпоративних клієнтів, створюючи комфорт і зручність на кожному етапі
          організації ваших ділових та мотиваційних поїздок.
        </p>
        <Image
          src="/images/corporate/hero/arrow.svg"
          alt="arrow"
          width="177"
          height="172"
          className="absolute top-[216px] xl:top-4 left-[calc(50%-64px)] xl:left-[calc(50%-489px)] xl:w-[220px] h-auto"
        />
      </Container>
    </section>
  );
}
