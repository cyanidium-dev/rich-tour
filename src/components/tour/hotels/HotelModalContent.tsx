"use client";

import Image from "next/image";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import HotelContent from "@/components/tour/hotels/HotelContent";
import styles from "./HotelModalContent.module.css";

type HotelModalContentProps = {
    title: string;
    stars: number | string;
    description: any;
    gallery: string[];
    className?: string;
};

export default function HotelModalContent({
                                              title,
                                              stars,
                                              description,
                                              gallery,
                                              className = "",
                                          }: HotelModalContentProps) {
    return (
        <div className={`lg:flex lg:items-stretch min-h-0 ${className}`}>
            {/* LEFT: высота будет равна высоте контента справа (или модалки) */}
            <div className="w-full lg:w-1/2 lg:shrink-0 min-w-0">
                <div className="relative w-full h-[320px] lg:h-full overflow-hidden">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={0}
                        loop
                        speed={600}
                        modules={[Navigation]}
                        navigation={true}
                        className={`${styles.hotelModalSwiper} h-full w-full`}
                    >
                        {gallery.map((url) => (
                            <SwiperSlide key={url} className="!w-full !h-full">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={url}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        priority
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* RIGHT: flex-col + scroll только тут */}
            <div className="w-full lg:w-1/2 min-w-0 min-h-0 flex flex-col lg:pl-6 pt-6 lg:pt-10">
                <div className={`${styles.hotelModalScroll} flex-1 overflow-y-auto`}>
                    <div className="pr-8">
                        <h3 className="text-2xl font-bold tracking-wide">
                            {title.toUpperCase()} {stars}*
                        </h3>

                        <div className="mt-4 text-sm leading-6 text-black/80">
                            <HotelContent value={description} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
