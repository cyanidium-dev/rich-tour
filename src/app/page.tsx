import { Hero } from "@/widgets/home-hero";
import { Tours } from "@/widgets/home-tours/server";
import { Promotion } from "@/widgets/home-promotion/server";
import { Benefits } from "@/widgets/home-benefits";
import { SmartTours } from "@/widgets/smart-tours/server";
import { Reviews } from "@/widgets/review-highlights/server";
import { Faq } from "@/widgets/home-faq/server";
import { CorporateService } from "@/widgets/corporate-service";
import { sanityClient as client, sanityFetchOptions, SANITY_CACHE_TAGS } from "@/shared/api/server";
import { allCountriesQuery } from "@/lib/sanity/queries";

export default async function Home() {
  const countries = await client.fetch<Array<{ _id: string; title: string }>>(
    allCountriesQuery,
    {},
    sanityFetchOptions(3600, [SANITY_CACHE_TAGS.countries]),
  );
  const countryOptions = countries.map((country) => ({
    key: country._id,
    label: country.title,
  }));

  return (
    <>
      <Hero countries={countryOptions} />
      <Tours />
      <Promotion />
      <Benefits />
      <SmartTours />
      <Reviews />
      <Faq />
      <CorporateService />
    </>
  );
}
