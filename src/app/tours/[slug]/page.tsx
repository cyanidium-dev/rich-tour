import { Suspense } from "react";
import { connection } from 'next/server';

import { toursList } from "@/components/home/promotion/mockedData";
import Loader from "@/components/shared/loader/Loader";
import Benefits from "@/components/tour/benefits/Benefits";
import Hero from "@/components/tour/hero/Hero";
// import Points from "@/components/tour/points/Points";
// import Program from "@/components/tour/program/Program";
// import TourCostDetails from "@/components/tour/tourCostDetails/TourCostDetails";
// import Inspiration from "@/components/tour/inspiration/Inspiration";
// import TourCost from "@/components/tour/tourCost/TourCost";

import client from "@/lib/sanity";
import {basicTourBySlugQuery, tourQuery} from "@/lib/queries";

interface TourPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TourPage({ params }: TourPageProps) {
  await connection();
  const { slug } = await params;

  const basicTour = await client.fetch(basicTourBySlugQuery, {slug});

  const tourToDate = await client.fetch(tourQuery, { tourBasicId: basicTour._id });
  console.log(tourToDate.benefits);
  // const tour = toursList.find((tour) => tour.slug === slug);
  let tour = toursList[0];
  // console.log(tour.benefits)
  tour = {
    ...tour,
    title: basicTour.title,
    duration: basicTour.duration,
    program: tourToDate.programUpload,
    images: [
      {
        alt: basicTour.title,
        url: basicTour.image.asset.url,
      },
        //@ts-expect-error
        ...tourToDate.gallery.slice(0, 2).map(({url})=> ({
          url,
          alt: basicTour.title,
        }))
    ],
    benefits: {
      //@ts-expect-error
      list: tourToDate.benefits.map(({children})=> ({text: children[0].text})),
      image: {
        url: tourToDate.gallery[3].url,
        alt: basicTour.title,
      }
    }
  }
  console.log(tour.benefits)
  // if (!tour) return null;

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Hero tour={tour} />
        <Benefits tour={tour} />
        {/*<Program tour={tour} />*/}
        {/*<Points tour={tour} />*/}
        {/*<TourCost tour={tour} />*/}
        {/*<TourCostDetails tour={tour} />*/}
        {/*<Inspiration tour={tour} />*/}
      </Suspense>
    </>
  );
}
