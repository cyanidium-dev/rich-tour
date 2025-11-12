import Container from "@/components/shared/container/Container";
import StepHeader from "@/components/home/step/StepHeader";
import Cta from "./Cta";
import NewHorizons from "./NewHorizons";
import AnimatedArrowTop from "./AnimatedArrowTop";
// import AnimatedArrowBottom from "./AnimatedArrowBottom";

const SECTION_ID = "step";

export default function Step() {
  return (
    <section
      id={SECTION_ID}
      className="mb-[148px] xl:mb-[180px] scroll-mt-[68px] lg:scroll-mt-[157px] xl:scroll-mt-[179px]"
    >
      <StepHeader />
      <Container className="relative flex flex-col md:flex-row gap-y-10 gap-x-5 ">
        <AnimatedArrowTop />
        {/*<AnimatedArrowBottom />*/}
        <Cta />
        <NewHorizons />
      </Container>
    </section>
  );
}
