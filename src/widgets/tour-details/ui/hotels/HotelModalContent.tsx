"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import type { TourHotel } from "@/entities/tour";
import HotelContent from "./HotelContent";
import styles from "./HotelModalContent.module.css";

type HotelModalContentProps = {
  title: string;
  stars?: number;
  description: TourHotel["fullDescription"];
  gallery: string[];
};

function GalleryArrow({ previous }: { previous: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className={previous ? "rotate-180" : undefined}
    >
      <circle cx="11" cy="11" r="8.75" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m9.9 7.9 3.1 3.1-3.1 3.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HotelModalContent({
  title,
  stars,
  description,
  gallery,
}: HotelModalContentProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <div className={styles.modalContent}>
      <div className={styles.galleryPane}>
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          loop={gallery.length > 1}
          speed={600}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className={`${styles.hotelModalSwiper} hotel-modal-gallery`}
        >
          {gallery.map((url, index) => (
            <SwiperSlide key={`${url}-${index}`}>
              <div className={styles.imageFrame}>
                <Image
                  src={url}
                  alt={`${title} — фото ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {gallery.length > 1 && (
          <div className={styles.galleryControls}>
            <button
              type="button"
              aria-label="Попереднє фото готелю"
              onClick={() => swiperRef.current?.slidePrev()}
              className={`${styles.galleryButton} ${styles.previousButton}`}
            >
              <GalleryArrow previous />
            </button>
            <button
              type="button"
              aria-label="Наступне фото готелю"
              onClick={() => swiperRef.current?.slideNext()}
              className={`${styles.galleryButton} ${styles.nextButton}`}
            >
              <GalleryArrow previous={false} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.hotelModalScroll}>
        <h3 className={styles.hotelTitle}>
          {title.toUpperCase()}
          {stars != null && <> {stars}*</>}
        </h3>
        <div className={styles.hotelDescription}>
          <HotelContent value={description} />
        </div>
      </div>
    </div>
  );
}
