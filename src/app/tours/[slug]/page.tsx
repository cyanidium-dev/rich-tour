import { notFound } from "next/navigation";

import AdditionalInfo from "./_components/AdditionalInfo";
import { TourDetails } from "@/widgets/tour-details";
import { sanityClient as client, sanityFetchOptions } from "@/shared/api/server";
import { tourPageQuery } from "@/entities/tour/server";
import { getAuthAgentProfile } from "@/lib/sanity/users/getAuthUserProfile";
import { mapTourPage, RawTourPage } from "@/entities/tour/server";

interface TourPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ departure?: string }>;
}

export default async function TourPage({ params, searchParams }: TourPageProps) {
  const [{ slug }, { departure: departureId }] = await Promise.all([params, searchParams]);

  const [rawTour, user] = await Promise.all([
    client.fetch<RawTourPage | null>(
      tourPageQuery,
      { slug, departureId: departureId || null },
      sanityFetchOptions(300, [`tour:${slug}`, "tours"]),
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
    <TourDetails
      {...userData}
      tour={tour}
      isLogin={Boolean(user)}
      additionalInfo={tour.additionalInfo ? <AdditionalInfo text={tour.additionalInfo} /> : null}
    />
  );
}
