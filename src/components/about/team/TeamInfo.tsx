import Container from "@/components/shared/container/Container";
import Image from "next/image";

export default function TeamInfo() {
  return (
    <div className="relative  pt-[156px] pb-[156px] md:py-[85px] overflow-hidden">
      <Image
        src="/images/about/team/bgImage.webp"
        alt="background"
        fill
        priority
        sizes="100vw"
        className="absolute top-0 left-0 -z-20 object-cover"
      />
      <div
        className="absolute top-[116px] md:top-[-131px] xl:top-[-226px] md:left-[calc(50%-339px)] left-0 xl:left-[calc(50%-394px)]
 -z-10 w-full h-[calc(100%-232px)] md:size-[677px] xl:size-[788px] py-10 md:py-[85px] md:mx-auto  bg-main md:rounded-full"
      ></div>
      <Container>
        <h2 className="mb-6 text-36med xl:text-40med text-center text-white">
          Наша команда
        </h2>
        <p className="max-w-[327px] xl:max-w-[516px] mx-auto text-16reg text-center text-white">
          Наша команда складається з професіоналів з багаторічним досвідом у
          сфері туризму, які щиро закохані у свою справу. Ми ретельно підбираємо
          маршрути, щоб ви могли насолоджуватися красою природи, культурною
          спадщиною та незабутніми моментами в кожній поїздці.
        </p>
      </Container>
    </div>
  );
}
