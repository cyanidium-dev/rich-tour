import Container from "@/components/shared/container/Container";
import Cta from "./Cta";
import NewHorizons from "./NewHorizons";
import Image from "next/image";

const SECTION_ID = "step";

export default function Step() {
  return (
    <section
      id={SECTION_ID}
      className="mb-[148px] xl:mb-[180px] scroll-mt-[68px] lg:scroll-mt-[77px] xl:scroll-mt-[99px]"
    >
      <Container className="relative flex flex-col md:flex-row gap-y-10 gap-x-5 ">
        <Image
          src="/images/home/step/arrowTop.svg"
          alt="arrow"
          width="290"
          height="161"
          className="hidden md:block absolute top-[-115px] left-[32%] lg:top-[-83px] lg:left-[42.35%]"
        />
        <Image
          src="/images/home/step/arrowBottom.svg"
          alt="arrow"
          width="118"
          height="125"
          className="hidden md:block absolute right-[43px] bottom-[105px] xl:right-[98px] xl:bottom-[85px]"
        />
        <NewHorizons />
        <Cta />
      </Container>
    </section>
  );
}
