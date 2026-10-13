"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Suspense } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
// import { toursList } from "../promotion/mockedData";
import { TourCard, type TourShortInfo } from "@/entities/tour/index";
import Loader from "@/components/shared/loader/Loader";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

export default function SmartToursSwiper({
  toursList,
}: {
  toursList: TourShortInfo[] | null | undefined;
}) {
  if (!toursList || !toursList?.length) {
    return null;
  }

  return (
    <Suspense fallback={<Loader className="w-full h-[406px] xl:h-[486px]" />}>
      <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.4 })}>
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
      </AnimatedWrapper>
    </Suspense>
  );
}
