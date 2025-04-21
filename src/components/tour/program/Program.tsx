import { Tour } from "@/types/tour";
import ProgramTitle from "./ProgramTitle";
import Container from "@/components/shared/container/Container";

interface ProgramProps {
  tour: Tour;
}

export default function Program({ tour }: ProgramProps) {
  return (
    <section className="mb-[74px] xl:mb-[100px]">
      <Container>
        <ProgramTitle />
      </Container>
    </section>
  );
}
