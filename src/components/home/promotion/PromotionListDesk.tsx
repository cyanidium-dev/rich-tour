import TourCard from "@/components/shared/tourCard/TourCard";
import { toursList } from "./mockedData";

export default function PromotionListDesk() {
  return (
    <ul className="hidden md:flex flex-wrap gap-5">
      {toursList.map((tour) => (
        <li key={tour.id}>
          <TourCard tour={tour} />
        </li>
      ))}
    </ul>
  );
}
