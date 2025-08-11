import Hero from "@/components/home/hero/Hero";
import Tours from "@/components/home/tours/Tours";
import Promotion from "@/components/home/promotion/Promotion";
import Benefits from "@/components/home/benefits/Benefits";
import SmartTours from "@/components/home/smartTours/SmartTours";
import Reviews from "@/components/shared/reviews/Reviews";
import Step from "@/components/home/step/Step";
import Faq from "@/components/home/faq/Faq";
import CorporateService from "@/components/home/corporateService/CorporateService";

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
