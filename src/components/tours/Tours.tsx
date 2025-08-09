"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "../shared/container/Container";
import TabMenu from "./TabMenu";
import ToursList from "./ToursList";

//@ts-expect-error
export default function Tours({categories}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  const [activeTab, setActiveTab] = useState(category);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.get("category")) {
      params.set("category", "all");
    }
    if (!params.get("page")) {
      params.set("page", "1");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return (
    <section className="pt-[33px] mb-[148px] xl:mb-[180px]">
      <Container>
        <AnimatedWrapper
          as="h1"
          animation={fadeInAnimation({ y: 30 })}
          className="mb-10 text-36med xl:text-48med text-center"
        >
          Тури
        </AnimatedWrapper>
        {/*@ts-expect-error*/}
        <TabMenu categories={categories} activeTab={activeTab} setActiveTab={setActiveTab} />
        <ToursList activeTab={activeTab} />
      </Container>
    </section>
  );
}
