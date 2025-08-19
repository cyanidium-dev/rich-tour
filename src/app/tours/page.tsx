import { Suspense } from "react";
// import { connection } from 'next/server';

import Tours from "@/components/tours/Tours";
import Loader from "@/components/shared/loader/Loader";

import client from "@/lib/sanity";
import {allActiveTourCategoriesQuery} from "@/lib/queries";

export const revalidate = 60;

export default async function ToursPage() {
    // await connection();
    const tourCategories = await client.fetch(allActiveTourCategoriesQuery);

  return (
    <Suspense fallback={<Loader />}>
      <Tours categories={tourCategories} />
    </Suspense>
  );
}
