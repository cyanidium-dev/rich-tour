import { Suspense } from "react";
import { connection } from 'next/server';

import { toursList } from "@/components/home/promotion/mockedData";
import Loader from "@/components/shared/loader/Loader";
import Benefits from "@/components/tour/benefits/Benefits";
import Hero from "@/components/tour/hero/Hero";
 import Program from "@/components/tour/program/Program";
import Points from "@/components/tour/points/Points";
import TourCost from "@/components/tour/tourCost/TourCost";
import TourCostDetails from "@/components/tour/tourCostDetails/TourCostDetails";
import Inspiration from "@/components/tour/inspiration/Inspiration";


import client from "@/lib/sanity";
import {basicTourBySlugQuery, tourQuery} from "@/lib/queries";

interface TourPageProps {
  params: Promise<{ slug: string }>;
}

//@ts-expect-error
const getList = serverList => {
  //@ts-expect-error
return serverList.reduce((acum, {children, level})=> {
  if(level === 2) {
    if(acum[acum.length - 1].sublist) {
      //@ts-expect-error
      acum[acum.length - 1].sublist.push(children.map(({text})=> text).join(""));
    }
    else {
      //@ts-expect-error
      acum[acum.length - 1].sublist = [children.map(({text})=> text).join("")]
    }
    return acum;
  }
  //@ts-expect-error
  const newItem = {text: children.map(({text})=> text).join("")};
  return [...acum, newItem]
}, [])
}

//@ts-expect-error
const getProgram = sections => {
  //@ts-expect-error
  const list = sections.map(({content})=> ({
    //@ts-expect-error
    sublist: content.map(({children})=> ({
      title: children[0].text
    }))
  }));

  return {
    url: "",
    list,
  }
}

export default async function TourPage({ params }: TourPageProps) {
  await connection();
  const { slug } = await params;

  const basicTour = await client.fetch(basicTourBySlugQuery, {slug});

  const tourToDate = await client.fetch(tourQuery, { tourBasicId: basicTour._id });

  let tour = toursList[0];

  tour = {
    ...tour,
    title: basicTour.title,
    duration: basicTour.duration,
    programUpload: tourToDate.programUpload,
    images: [
      {
        alt: basicTour.title,
        url: basicTour.image.asset.url,
      },
        //@ts-expect-error
        ...tourToDate.gallery.map(({url})=> ({
          url,
          alt: basicTour.title,
        }))
    ],
    benefits: {
      list: getList(tourToDate.benefits),
      image: {
        url: tourToDate.gallery[3].url,
        alt: basicTour.title,
      }
    },
    program: getProgram(tourToDate.sections),
    //@ts-expect-error
    points: tourToDate.route.map(({children})=> children[0].text),
    //@ts-expect-error
    includedInCost: tourToDate.includes.map(({children})=> children[0].text),
    //@ts-expect-error
    notIncludedInCost: tourToDate.unincludes.map(({children})=> children[0].text),
  }

  // if (!tour) return null;

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Hero tour={tour} />
        <Benefits tour={tour} />
        <Program tour={tour} />
        <Points tour={tour} />
        <TourCost tour={tour} />
        <TourCostDetails tour={tour} />
        {tourToDate.inspiration && <Inspiration tour={tour} />}
      </Suspense>
    </>
  );
}
