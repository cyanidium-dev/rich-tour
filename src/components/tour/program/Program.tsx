import { Tour } from "@/types/tour";
import ProgramTitle from "./ProgramTitle";
import Container from "@/components/shared/container/Container";
import ProgramList from "./ProgramList";

interface ProgramProps {
  tour: Tour;
}

export default function Program({ tour }: ProgramProps) {
  const { program } = tour;

  return (
    <section className="mb-[125px] xl:mb-[180px]">
      <Container>
        <ProgramTitle />
        <ProgramList programList={program?.list} />
      </Container>
    </section>
  );
}
