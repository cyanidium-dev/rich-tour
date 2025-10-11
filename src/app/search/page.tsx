import { Suspense } from "react";
import { connection } from 'next/server';

import Search from "@/components/search/Search";
import Loader from "@/components/shared/loader/Loader";

import client from "@/lib/sanity";
import {allCOuntriesQuery} from "@/lib/queries";

//@ts-expect-error
export default async function SearchPage({ searchParams }) {
    await connection();
    const {country, month} = searchParams;
    // const tours = await client.fetch(allActiveTourCategoriesQuery, {country, month});
    const countries = await client.fetch(allCOuntriesQuery, {country, month});
    console.log(countries)

  return (
        <Suspense fallback={<Loader />}>
            <Search />
        </Suspense>
  );
}
