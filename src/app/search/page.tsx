import { Suspense } from "react";

import Search from "@/components/search/Search";
import Loader from "@/components/shared/loader/Loader";

import { sanityClient as client, sanityFetchOptions, SANITY_CACHE_TAGS } from "@/shared/api/server";
import { searchToursQuery } from "@/entities/tour/server";
import { allCountriesQuery } from "@/lib/sanity/queries";
import { TourShortInfo } from "@/entities/tour";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; month?: string }>;
}) {
  const { country, month } = await searchParams;
  const validMonth = month && /^(0[1-9]|1[0-2])$/.test(month) ? month : undefined;
  const [countries, tours] = await Promise.all([
    client.fetch<Array<{ _id: string; title: string }>>(
      allCountriesQuery,
      {},
      sanityFetchOptions(3600, [SANITY_CACHE_TAGS.countries]),
    ),
    client.fetch<TourShortInfo[]>(
      searchToursQuery,
      {
        countryId: country || null,
        monthPattern: validMonth ? `*-${validMonth}-*` : null,
      },
      sanityFetchOptions(300, [SANITY_CACHE_TAGS.tours]),
    ),
  ]);
  const countryOptions = countries.map((item) => ({ key: item._id, label: item.title }));

  return (
    <Suspense fallback={<Loader />}>
      <Search countries={countryOptions} tours={tours} country={country} month={validMonth} />
    </Suspense>
  );
}
