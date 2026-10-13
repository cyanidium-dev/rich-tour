"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import { Container } from "@/shared/ui";
import { TourShortInfo } from "@/entities/tour";
import TabMenu, { TourCategory } from "./TabMenu";
import ToursList from "./ToursList";

export default function Tours({
  categories,
  tours,
}: {
  categories: TourCategory[];
  tours: TourShortInfo[];
}) {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category") ?? "all";
  const initialCategoryId =
    categories.find((item) => item.title === requestedCategory)?._id ?? "all";
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId);

  const filteredTours = useMemo(
    () =>
      activeCategoryId === "all"
        ? tours
        : tours.filter((tour) =>
            tour.categories?.some((category) => category._ref === activeCategoryId),
          ),
    [activeCategoryId, tours],
  );

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
        <TabMenu
          categories={categories}
          activeCategoryId={activeCategoryId}
          onChange={setActiveCategoryId}
        />
        <ToursList key={activeCategoryId} tours={filteredTours} />
      </Container>
    </section>
  );
}
