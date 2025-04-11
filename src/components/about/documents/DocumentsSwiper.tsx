"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Suspense } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { documentsList } from "./mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Loader from "@/components/shared/loader/Loader";
import DocumentCard from "./DocumentCard";

export default function DocumentsSwiper() {
  return (
    <Suspense fallback={<Loader />}>
      <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.8 })}>
        <Swiper
          slidesPerView={"auto"}
          centeredSlides
          breakpoints={{
            0: {
              spaceBetween: 55,
              centeredSlides: true,
            },
            640: {
              spaceBetween: 55,
              centeredSlides: false,
            },
            768: {
              spaceBetween: 20,
              centeredSlides: false,
            },
            1024: { spaceBetween: 55 },
            1280: {
              spaceBetween: 20,
              centeredSlides: false,
            },
          }}
          navigation={true}
          loop={true}
          speed={1000}
          modules={[Navigation]}
          className="documents"
        >
          {documentsList.map((document, idx) => (
            <SwiperSlide key={idx}>
              <DocumentCard document={document} />
            </SwiperSlide>
          ))}
        </Swiper>
      </AnimatedWrapper>
    </Suspense>
  );
}
