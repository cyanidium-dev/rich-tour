import type { ReactNode } from "react";
import type { Tour } from "@/entities/tour";
import Benefits from "./benefits/Benefits";
import Excursions from "./excursions/Excursions";
import Hero from "./hero/Hero";
import Hotels from "./hotels/Hotels";
import HotelsList from "./hotels/HotelsList";
import Inspiration from "./inspiration/Inspiration";
import Points from "./points/Points";
import Program from "./program/Program";
import TourCost from "./tourCost/TourCost";
import TourCostDetails from "./tourCostDetails/TourCostDetails";

type TourDetailsProps = {
  tour: Tour;
  isLogin: boolean;
  companyName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  additionalInfo?: ReactNode;
};

export default function TourDetails({
  tour,
  isLogin,
  additionalInfo,
  ...userData
}: TourDetailsProps) {
  const hotels = (tour.hotels ?? []).filter((hotel) => hotel.gallery.length > 0);

  return (
    <>
      <Hero {...userData} tour={tour} />
      {tour.benefits.list.length > 0 && <Benefits tour={tour} />}
      {hotels.length === 1 && <Hotels {...hotels[0]} />}
      {hotels.length > 1 && <HotelsList key={tour.selectedDepartureId} hotels={hotels} />}
      {tour.program.list.length > 0 && <Program tour={tour} />}
      {tour.excursions && <Excursions tour={tour} />}
      <Points tour={tour} />
      <TourCost {...userData} isLogin={isLogin} tour={tour} />
      {additionalInfo}
      {(tour.includedInCost.length > 0 || tour.notIncludedInCost.length > 0) && (
        <TourCostDetails tour={tour} />
      )}
      {tour.inspiration.length > 0 && <Inspiration tour={tour} />}
    </>
  );
}
