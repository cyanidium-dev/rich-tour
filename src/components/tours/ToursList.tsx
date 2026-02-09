"use client";
import { useState, useEffect, Suspense } from "react";
import { useToursItemsPerPage } from "@/hooks/useToursItemsPerPage";
// import { toursList } from "../home/promotion/mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import TourCard from "@/components/shared/cards/tourCard/TourCard";
import Loader from "@/components/shared/loader/Loader";
import Pagination from "@/components/shared/pagination/Pagination";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import {TourShortInfo} from "@/types/tour";

import client from "@/lib/sanity/client";
import {basicToursQuery} from "@/lib/sanity/queries";

const SECTION_ID = "tours-page-tours-list";

interface ToursListProps {
  activeTab: string;
}

export default function ToursList({ activeTab }: ToursListProps) {
    const [toursList, setToursList] = useState([]);

    useEffect(() => {
        const fetchTours = async()=> {
            try {
                const params = {
                    categoryId: (activeTab !== "all" && activeTab) ? activeTab : null,
                }
                console.log(activeTab)
                const data = await client.fetch(basicToursQuery, params);
                setToursList(data);
            }
            catch(error){
                console.log(error);
            }
        };
        fetchTours();
    }, [activeTab]);

  if (!toursList) {
    return null;
  }

  // const filteredTours =
  //   activeTab === "all"
  //     ? toursList
  //     : toursList?.filter(({ category }) => category?.value === activeTab);

  if (!toursList?.length)
    return (
      <p className="pt-[80px] pb-[40px] text-center text-black/70 font-semibold text-[22px]">
        В даній категорії немає турів
      </p>
    );
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex flex-col items-center justify-center mt-[50px] xl:mt-10">
        <Pagination
          items={toursList}
          scrollTargetId={SECTION_ID}
          useItemsPerPage={useToursItemsPerPage}
          className="w-full max-w-[325px] sm:max-w-[440px] md:max-w-[718px] lg:max-w-[974px] xl:max-w-[1120px]"
          renderItems={(currentItems) => (
            <ul
              id={SECTION_ID}
              className="flex flex-col sm:flex-row sm:flex-wrap flex-wrap gap-5"
              key={activeTab}
            >
              {currentItems.map((tour: TourShortInfo) => (
                <AnimatedWrapper
                  as="li"
                  animation={fadeInAnimation({ y: 30, delay: 0.4 })}
                  key={tour._id}
                  className="max-w-[325px] sm:max-w-[210px] md:max-w-[226px] lg:max-w-[228px] xl:max-w-[265px]"
                >
                  <TourCard tour={tour} />
                </AnimatedWrapper>
              ))}
            </ul>
          )}
        />
      </div>
    </Suspense>
  );
}
