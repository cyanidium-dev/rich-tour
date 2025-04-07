import Container from "@/components/shared/container/Container";
import Cta from "./Cta";
import NewHorizons from "./NewHorizons";

const SECTION_ID = "step";

export default function Step() {
  return (
    <section
      id={SECTION_ID}
      className="mb-[148px] xl:mb-[180px] overflow-hidden"
    >
      <Container className="flex flex-col md:flex-row gap-y-10 gap-x-5 ">
        <NewHorizons />
        <Cta />
      </Container>
    </section>
  );
}
