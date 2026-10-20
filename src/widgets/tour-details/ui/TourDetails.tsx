import type { ReactNode } from "react";
import type { Tour } from "@/entities/tour";
import { Container } from "@/shared/ui";
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
  preview?: boolean;
  showDraftBanner?: boolean;
  previewDate?: string;
  previewMissing?: {
    title: boolean;
    duration: boolean;
    basic: boolean;
    date: boolean;
    crm: boolean;
    price: boolean;
  };
};

export default function TourDetails({
  tour,
  isLogin,
  additionalInfo,
  preview = false,
  showDraftBanner = false,
  previewDate,
  previewMissing,
  ...userData
}: TourDetailsProps) {
  const hotels = (tour.hotels ?? []).filter((hotel) => hotel.gallery.length > 0);

  return (
    <>
      {preview && showDraftBanner && (
        <Container className="pt-6">
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-4">
            <p className="font-semibold">Попередній перегляд чернетки</p>
            {previewDate && <p className="mt-1 text-sm">Дата виїзду: {previewDate}</p>}
            {previewMissing && Object.values(previewMissing).some(Boolean) && (
              <p className="mt-2 text-sm">
                Не заповнено:{" "}
                {[
                  previewMissing.title && "назву",
                  previewMissing.duration && "тривалість",
                  previewMissing.basic && "базовий тур",
                  previewMissing.date && "дату виїзду",
                  previewMissing.crm && "CRM-номер",
                  previewMissing.price && "ціну",
                ]
                  .filter(Boolean)
                  .join(", ")}
                .
              </p>
            )}
          </div>
        </Container>
      )}
      <Hero
        {...userData}
        tour={tour}
        preview={preview}
        missingDuration={previewMissing?.duration}
      />
      {tour.benefits.list.length > 0 && <Benefits tour={tour} />}
      {hotels.length === 1 && <Hotels {...hotels[0]} />}
      {hotels.length > 1 && <HotelsList key={tour.selectedDepartureId} hotels={hotels} />}
      {tour.program.list.length > 0 && <Program tour={tour} />}
      {tour.excursions && <Excursions tour={tour} />}
      <Points tour={tour} />
      <TourCost
        {...userData}
        isLogin={isLogin}
        tour={tour}
        preview={preview}
        missingDate={previewMissing?.date}
      />
      {additionalInfo}
      {(tour.includedInCost.length > 0 || tour.notIncludedInCost.length > 0) && (
        <TourCostDetails tour={tour} />
      )}
      {tour.inspiration.length > 0 && <Inspiration tour={tour} />}
    </>
  );
}
