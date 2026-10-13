import Documents from "@/components/about/documents/Documents";
import Hero from "@/components/about/hero/Hero";
import Mission from "@/components/about/mission/Mission";
import Team from "@/components/about/team/Team";
import { Reviews } from "@/widgets/review-highlights/server";

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Mission />
      <Team />
      <Documents />
      <Reviews />
    </>
  );
}
