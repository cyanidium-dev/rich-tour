"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import TourCard from "@/components/shared/cards/tourCard/TourCard";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import {TourShortInfo} from "@/types/tour";

export default function PromotionSwiperMob({tours}: {tours: TourShortInfo[]}) {
  if (!tours.length) {
    return null;
  }

  return (
    <Suspense fallback={<Loader className="md:hidden w-full h-[406px]" />}>
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="md:hidden"
      >
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={20}
          navigation={true}
          loop={true}
          speed={1000}
          modules={[Navigation]}
        >
          {tours.map((tour) => (
            <SwiperSlide key={tour._id}>
              <TourCard tour={tour} />
            </SwiperSlide>
          ))}
        </Swiper>
      </AnimatedWrapper>
    </Suspense>
  );
}
