import { Tour } from "@/types/tour";
import IncludedList from "./IncludedList";
import NotIncludedList from "./NotIncludedList";
import Container from "@/components/shared/container/Container";

interface TourCostDetailsProps {
  tour: Tour;
}

export default function TourCostDetails({ tour }: TourCostDetailsProps) {
  const { includedInCost, notIncludedInCost } = tour;

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="flex flex-col md:flex-row gap-y-[70px]">
        <IncludedList includedInCost={includedInCost} />
        <NotIncludedList notIncludedInCost={notIncludedInCost} />
      </Container>
    </section>
  );
}
