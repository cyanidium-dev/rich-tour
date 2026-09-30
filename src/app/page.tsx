import Hero from "@/components/home/hero/Hero";
import Tours from "@/components/home/tours/Tours";
import Promotion from "@/components/home/promotion/Promotion";
import Benefits from "@/components/home/benefits/Benefits";
import SmartTours from "@/components/home/smartTours/SmartTours";
import Reviews from "@/components/shared/reviews/Reviews";
import Faq from "@/components/home/faq/Faq";
import CorporateService from "@/components/home/corporateService/CorporateService";
import client from "@/lib/sanity/client";
import {allCountriesQuery} from "@/lib/sanity/queries";

export default async function Home() {
  const countries = await client.fetch<Array<{_id: string; title: string}>>(
    allCountriesQuery,
    {},
    {next: {revalidate: 3600, tags: ["countries"]}},
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
