import Benefits from "@/components/home/benefits/Benefits";
import CorporateService from "@/components/home/corporateService/CorporateService";
import Faq from "@/components/home/faq/Faq";
import Hero from "@/components/home/hero/Hero";
import Promotion from "@/components/home/promotion/Promotion";
import Reviews from "@/components/home/reviews/Reviews";
import SmartTours from "@/components/home/smartTours/SmartTours";
import Tours from "@/components/home/tours/Tours";
import Step from "@/components/home/step/Step";

export default function Home() {
  return (
    <>
      <Hero />
      <Tours />
      <Promotion />
      <Benefits />
      <SmartTours />
      <Reviews />
      <Step />
      <Faq />
      <CorporateService />
    </>
  );
}
