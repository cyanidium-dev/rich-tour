import { toursList } from "@/components/home/promotion/mockedData";
import Benefits from "@/components/tour/benefits/Benefits";
import Hero from "@/components/tour/hero/Hero";

interface TourPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;

  const tour = toursList.find((tour) => tour.slug === slug);

  if (!tour) return null;

  return (
    <>
      <Hero tour={tour} />
      <Benefits tour={tour} />
    </>
  );
}
