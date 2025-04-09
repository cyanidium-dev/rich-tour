"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Suspense } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { documentsList } from "./mockedData";
import Loader from "@/components/shared/loader/Loader";
import DocumentCard from "./DocumentCard";

export default function DocumentsSwiper() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="md:hidden mt-[148px]">
        <Swiper
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={25}
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
      </div>
    </Suspense>
  );
}
