"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { toursList } from "./mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import TourCard from "@/components/shared/cards/tourCard/TourCard";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

export default function PromotionSwiperMob() {
  if (!toursList || !toursList.length) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
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
          {toursList.map((tour, idx) => (
            <SwiperSlide key={idx}>
              {/*  @ts-expect-error*/}
              <TourCard tour={tour} />
            </SwiperSlide>
          ))}
        </Swiper>
      </AnimatedWrapper>
    </Suspense>
  );
}
