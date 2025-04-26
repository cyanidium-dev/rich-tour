"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Suspense } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// import { reviewsList } from "./mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import Loader from "@/components/shared/loader/Loader";
import ReviewCard from "@/components/shared/cards/reviewCard/ReviewCard";
import AnimatedWrapper from "../animation/AnimatedWrapper";

//@ts-expect-error
export default function ReviewsSwiperMob({items}) {
  // if (!reviewsList || !reviewsList.length) {
  //   return null;
  // }

  return (
    <AnimatedWrapper
      animation={fadeInAnimation({ y: 30, delay: 0.4 })}
      className="lg:hidden mt-9"
    >
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
          {/*@ts-expect-error*/}
          {items.map((review, idx) => (
            <SwiperSlide key={idx}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Suspense>
    </AnimatedWrapper>
  );
}
