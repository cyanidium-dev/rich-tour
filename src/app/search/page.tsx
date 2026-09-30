import { Suspense } from "react";

import Search from "@/components/search/Search";
import Loader from "@/components/shared/loader/Loader";

import client from "@/lib/sanity/client";
import {allCountriesQuery, searchToursQuery} from "@/lib/sanity/queries";
import {TourShortInfo} from "@/types/tour";

export default async function SearchPage({ searchParams }: {searchParams: Promise<{country?: string; month?: string}>}) {
    const {country, month} = await searchParams;
    const validMonth = month && /^(0[1-9]|1[0-2])$/.test(month) ? month : undefined;
    const [countries, tours] = await Promise.all([
        client.fetch<Array<{_id: string; title: string}>>(allCountriesQuery, {}, {
            next: {revalidate: 3600, tags: ["countries"]},
        }),
        client.fetch<TourShortInfo[]>(searchToursQuery, {
            countryId: country || null,
            monthPattern: validMonth ? `*-${validMonth}-*` : null,
        }, {
            next: {revalidate: 300, tags: ["tours"]},
        }),
    ]);
    const countryOptions = countries.map((item) => ({key: item._id, label: item.title}));

  return (
        <Suspense fallback={<Loader />}>
            <Search
                countries={countryOptions}
                tours={tours}
                country={country}
                month={validMonth}
            />
        </Suspense>
  );
}
