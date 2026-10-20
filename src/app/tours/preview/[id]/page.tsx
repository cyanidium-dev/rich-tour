import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import {
  RawPreviewDeparture,
  RawTourPage,
  mapTourPreview,
  previewTourDepartureQuery,
  publishedTourDepartureExistsQuery,
  tourDatesQuery,
} from "@/entities/tour/server";
import { sanityClient } from "@/shared/api/server";
import { TOUR_PREVIEW_COOKIE, verifyTourPreviewSession } from "@/lib/tour-preview/session";
import { TourDetails } from "@/widgets/tour-details";
import AdditionalInfo from "../../[slug]/_components/AdditionalInfo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function TourPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  if (!(await verifyTourPreviewSession(cookieStore.get(TOUR_PREVIEW_COOKIE)?.value, id))) {
    notFound();
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) notFound();
  const client = sanityClient.withConfig({ token, perspective: "drafts", useCdn: false });
  const [rawDeparture, isPublished] = await Promise.all([
    client.fetch<RawPreviewDeparture | null>(
      previewTourDepartureQuery,
      { id },
      { cache: "no-store" },
    ),
    client
      .withConfig({ perspective: "raw" })
      .fetch<boolean>(publishedTourDepartureExistsQuery, { id }, { cache: "no-store" }),
  ]);
  if (!rawDeparture) notFound();

  const departures = rawDeparture.basicId
    ? await client.fetch<RawTourPage["departures"]>(
        tourDatesQuery,
        { tourBasicId: rawDeparture.basicId },
        { cache: "no-store" },
      )
    : [];
  const preview = mapTourPreview(rawDeparture, departures);
  if (!preview) notFound();

  return (
    <TourDetails
      tour={preview.tour}
      preview
      showDraftBanner={!isPublished}
      previewDate={rawDeparture.dateRange?.startDate}
      previewMissing={preview.missing}
      isLogin={false}
      companyName={undefined}
      email={undefined}
      phone={undefined}
      additionalInfo={
        preview.tour.additionalInfo ? <AdditionalInfo text={preview.tour.additionalInfo} /> : null
      }
    />
  );
}
