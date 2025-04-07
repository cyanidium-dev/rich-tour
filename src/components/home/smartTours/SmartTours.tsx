import Image from "next/image";
import Container from "@/components/shared/container/Container";
import SmartToursSwiper from "./SmartToursSwiper";

const SECTION_ID = "smart-tours";

export default function SmartTours() {
  return (
    <section id={SECTION_ID} className="relative mb-[148px] xl:mb-[180px]">
      <Container className="md:flex mb-10 md:mb-0">
        <div className="relative w-full md:w-[325px] xl:w-[455px] h-[408px] md:h-[332px] xl:h-[408px] py-9 md:mr-5 rounded-[12px] text-white overflow-hidden">
          <Image
            src="/images/home/smart/smartBg.webp"
            alt="background"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="absolute top-0 left-0 -z-20 object-cover"
          />
          <div className="absolute -z-10 top-[-164px] left-[calc(50%-163px)] w-[326px] h-[341px] rounded-full bg-main"></div>
          <h2 className="max-w-[143px] xl:max-w-[257px] mx-auto mb-[147px] md:mb-[73px] xl:mb-[119px] text-36med xl:text-48med text-center">
            SMART тури
          </h2>
          <p className="max-w-[221px] xl:max-w-[342px] mx-auto text-16reg xl:text-20reg text-center">
            це концепція сучасного туризму, поєднує інноваційний підхід,
            індивідуальний сервіс та вигідні умови.
          </p>
        </div>
        <div className="hidden md:block md:w-[calc(100%-345px)] xl:w-[calc(100%-475px)]">
          <SmartToursSwiper />
        </div>
      </Container>
      <div className="md:hidden">
        {" "}
        <SmartToursSwiper />
      </div>
    </section>
  );
}
