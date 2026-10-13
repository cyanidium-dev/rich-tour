import { Tour } from "@/entities/tour/index";
import IncludedList from "./IncludedList";
import NotIncludedList from "./NotIncludedList";
import { Container } from "@/shared/ui/index";

interface TourCostDetailsProps {
  tour: Tour;
}

export default function TourCostDetails({ tour }: TourCostDetailsProps) {
  const { includedInCost, notIncludedInCost } = tour;
  const hasIncluded = includedInCost.length > 0;
  const hasNotIncluded = notIncludedInCost.length > 0;
  const hasStrongIncludedMajority =
    hasNotIncluded &&
    includedInCost.length >= notIncludedInCost.length * 2 &&
    includedInCost.length - notIncludedInCost.length >= 3;
  const fullWidth = hasStrongIncludedMajority || !hasIncluded || !hasNotIncluded;

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container
        className={`flex flex-col ${fullWidth ? "gap-y-8 lg:gap-y-10" : "gap-y-[70px] md:flex-row"}`}
      >
        <IncludedList includedInCost={includedInCost} fullWidth={fullWidth} />
        {hasStrongIncludedMajority && <hr className="w-full border-t border-lightGrey" />}
        <NotIncludedList notIncludedInCost={notIncludedInCost} fullWidth={fullWidth} />
      </Container>
    </section>
  );
}
