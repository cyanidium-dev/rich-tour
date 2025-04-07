"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { toursList } from "./mockedData";
import TourCard from "@/components/shared/tourCard/TourCard";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";

export default function PromotionSwiperMob() {
  if (!toursList || !toursList.length) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="md:hidden">
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
              <TourCard tour={tour} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
