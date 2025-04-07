"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Suspense } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { reviewsList } from "./mockedData";
import Loader from "@/components/shared/loader/Loader";
import ReviewCard from "@/components/shared/cards/reviewCard/ReviewCard";

export default function ReviewsSwiperMob() {
  if (!reviewsList || !reviewsList.length) {
    return null;
  }

  return (
    <div className="lg:hidden mt-9">
      <Suspense fallback={<Loader />}>
        <Swiper
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={20}
          navigation={true}
          loop={true}
          speed={1000}
          modules={[Navigation]}
          className="reviews"
        >
          {reviewsList.map((review, idx) => (
            <SwiperSlide key={idx}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Suspense>
    </div>
  );
}
