import { notFound } from "next/navigation";

import AdditionalInfo from "@/components/tour/additionalInfo/AdditionalInfo";
import Benefits from "@/components/tour/benefits/Benefits";
import Excursions from "@/components/tour/excursions/Excursions";
import Hero from "@/components/tour/hero/Hero";
import Hotels from "@/components/tour/hotels/Hotels";
import Inspiration from "@/components/tour/inspiration/Inspiration";
import Points from "@/components/tour/points/Points";
import Program from "@/components/tour/program/Program";
import TourCost from "@/components/tour/tourCost/TourCost";
import TourCostDetails from "@/components/tour/tourCostDetails/TourCostDetails";
import client from "@/lib/sanity/client";
import { tourPageQuery } from "@/lib/sanity/queries";
import { getAuthAgentProfile } from "@/lib/sanity/users/getAuthUserProfile";
import { mapTourPage, RawTourPage } from "@/lib/tours/mapTourPage";

interface TourPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ departure?: string }>;
}

export default async function TourPage({ params, searchParams }: TourPageProps) {
  const [{ slug }, { departure: departureId }] = await Promise.all([
    params,
    searchParams,
  ]);

  const [rawTour, user] = await Promise.all([
    client.fetch<RawTourPage | null>(
      tourPageQuery,
      { slug, departureId: departureId || null },
      { next: { revalidate: 300, tags: [`tour:${slug}`, "tours"] } }
    ),
    getAuthAgentProfile(),
  ]);

  if (!rawTour) notFound();

  const tour = mapTourPage(rawTour);
  if (!tour) notFound();

  const userData = {
    companyName: user?.companyName,
    email: user?.email,
    phone: user?.phone,
  };

  return (
    <>
      <Hero {...userData} tour={tour} />
      {tour.benefits.image && tour.benefits.list.length > 0 && <Benefits tour={tour} />}
      {tour.hotels?.map((hotel) =>
        hotel.gallery.length > 0 ? <Hotels key={hotel.title} {...hotel} /> : null
      )}
      {tour.program.list.length > 0 && <Program tour={tour} />}
      {tour.excursions && <Excursions tour={tour} />}
      <Points tour={tour} />
      <TourCost
        {...userData}
        isLogin={Boolean(user)}
        tour={tour}
      />
      {tour.additionalInfo && <AdditionalInfo text={tour.additionalInfo} />}
      {(tour.includedInCost.length > 0 || tour.notIncludedInCost.length > 0) && (
        <TourCostDetails tour={tour} />
      )}
      {tour.inspiration.length > 0 && <Inspiration tour={tour} />}
    </>
  );
}
