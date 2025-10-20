import { Suspense } from "react";
import { connection } from 'next/server';

import { toursList } from "@/components/home/promotion/mockedData";
import Loader from "@/components/shared/loader/Loader";
import Benefits from "@/components/tour/benefits/Benefits";
import Hero from "@/components/tour/hero/Hero";
import Program from "@/components/tour/program/Program";
import Excursions from "@/components/tour/excursions/Excursions";
import Points from "@/components/tour/points/Points";
import TourCost from "@/components/tour/tourCost/TourCost";
import TourCostDetails from "@/components/tour/tourCostDetails/TourCostDetails";
import Inspiration from "@/components/tour/inspiration/Inspiration";


import client from "@/lib/sanity";
import {basicTourBySlugQuery, tourDatesQuery, tourQuery} from "@/lib/queries";
// import {tourDepartures} from "@/components/tour/tourCost/mockedData";

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
  if(!sections || !sections.length) return null;
  //@ts-expect-error
  const list = sections.map(({content, title})=> ({
    content,
    title,
  }));

  return {
    url: "",
    list,
  }
}

//@ts-expect-error
const getTourDepartures = dates => dates.reduce((acum, {dateRange, price})=> {
  const [year, month, day] = dateRange.startDate.split("-");
  const date = `${year}-${month}`;
  const tour =  { day: parseInt(day), price, status: ["available"] };
  if(acum[date]) {
    acum[date].push(tour);
  }
  else {
    acum[date] = [tour]
  }
  return acum;
}, {});

export default async function TourPage({ params }: TourPageProps) {
  await connection();
  const { slug } = await params;

  const basicTour = await client.fetch(basicTourBySlugQuery, {slug});

  const tourToDate = await client.fetch(tourQuery, { tourBasicId: basicTour._id });
  const tourDates = await client.fetch(tourDatesQuery, { tourBasicId: basicTour._id });
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
    //@ts-expect-error
    program: getProgram(tourToDate.sections),
    //@ts-expect-error
    excursions: getProgram(tourToDate.excursions),
    tourDepartures: getTourDepartures(tourDates),
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
        {tour?.excursions && <Excursions tour={tour} />}
        <Points tour={tour} />
        <TourCost tour={tour} />
        <TourCostDetails tour={tour} />
        {tourToDate.inspiration && <Inspiration tour={tour} />}
      </Suspense>
    </>
  );
}
