import { Suspense } from "react";
import { toursList } from "@/components/home/promotion/mockedData";
import Loader from "@/components/shared/loader/Loader";
import Benefits from "@/components/tour/benefits/Benefits";
import Hero from "@/components/tour/hero/Hero";
import Points from "@/components/tour/points/Points";
import Program from "@/components/tour/program/Program";
import TourCostDetails from "@/components/tour/tourCostDetails/TourCostDetails";
import Inspiration from "@/components/tour/inspiration/Inspiration";
import TourCost from "@/components/tour/tourCost/TourCost";

interface TourPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;

  const tour = toursList.find((tour) => tour.slug === slug);

  if (!tour) return null;

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Hero tour={tour} />
        <Benefits tour={tour} />
        <Program tour={tour} />
        <Points tour={tour} />
        <TourCost tour={tour} />
        <TourCostDetails tour={tour} />
        <Inspiration tour={tour} />
      </Suspense>
    </>
  );
}
