import Image from "next/image";
import Container from "@/components/shared/container/Container";
import Search from "./Search";

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
      <div className="absolute top-0 left-0 -z-10 w-full h-full bg-hero"></div>
      <Container className="pt-[35px] pb-[30px] xl:pt-[44px] xl:pb-[34px]">
        <h1 className="max-w-[283px] md:max-w-[548px] mb-[140px] xl:mb-[89px] mx-auto text-14reg xl:text-16reg text-center text-white">
          Ми підберемо для вас ідеальний тур: пляжний релакс, захоплюючі
          екскурсії, або яскраві пригоди. Плануйте подорож легко та комфортно
          разом із професіоналами.
        </h1>
        <p className="max-w-[259px] md:max-w-[692px] mb-20 xl:mb-[88px] mx-auto text-32med xl:text-48med text-center uppercase text-white">
          Відпочинок вашої мрії ближче, ніж здається
        </p>
        <Search />
      </Container>
    </section>
  );
}
