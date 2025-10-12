import { Tour } from "@/types/tour";
import ExcursionsTitle from "./ExcursionsTitle";
import Container from "@/components/shared/container/Container";
import ExcursionsList from "./ExcursionsList";

interface ProgramProps {
  tour: Tour;
}

export default function Excursions({ tour }: ProgramProps) {
  const { excursions } = tour;

  return (
    <section className="mb-[125px] xl:mb-[180px]">
      <Container>
        <ExcursionsTitle />
        {/*  @ts-expect-error*/}
        <ExcursionsList programList={excursions?.list} />
      </Container>
    </section>
  );
}
