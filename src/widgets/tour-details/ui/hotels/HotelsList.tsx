"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";

import ArrowInCircleIcon from "@/components/shared/icons/ArrowInCircleIcon";
import { useCurrency } from "@/context/CurrencyContext";
import type { TourHotel } from "@/entities/tour";
import { Container } from "@/shared/ui";
import HotelModal from "./HotelModal";
import HotelModalContent from "./HotelModalContent";
import HotelsTitle from "./HotelsTitle";

function getPageSize() {
  if (window.innerWidth >= 1280) return 4;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function getSummary(hotel: TourHotel) {
  return hotel.shortDescription
    .map((block) => block.children?.map((child) => child.text ?? "").join("") ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function HotelCard({ hotel, onDetails }: { hotel: TourHotel; onDetails: () => void }) {
  const { convert, selected: currency } = useCurrency();

  return (
    <article className="flex h-full min-h-[390px] flex-col overflow-hidden rounded-xl bg-white shadow-card">
      <div className="relative h-[150px] shrink-0 overflow-hidden">
        <Image
          src={hotel.galleryVariants?.[0]?.card ?? hotel.gallery[0]}
          alt={hotel.title}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <h3 className="text-[20px] font-semibold leading-tight text-black">
          {hotel.title}
          {hotel.stars != null && <> {hotel.stars}★</>}
        </h3>
        <p className="mt-5 line-clamp-5 text-[14px] leading-[1.3] text-black/85">
          {getSummary(hotel)}
        </p>
        <p className="mt-auto pt-6 text-[14px] font-semibold text-black">
          від {convert(hotel.price)} {currency === "EUR" ? "€" : "₴"}
        </p>
        <button
          type="button"
          onClick={onDetails}
          className="mt-5 flex min-h-9 w-full cursor-pointer items-center justify-center rounded-full border-2 border-main text-[14px] font-semibold text-black transition-colors hover:bg-main hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
        >
          Детальніше
        </button>
      </div>
    </article>
  );
}

export default function HotelsList({ hotels }: { hotels: TourHotel[] }) {
  const [pageSize, setPageSize] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState<TourHotel>(hotels[0]);
  const [isPopUpShown, setIsPopUpShown] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const updatePageSize = () => {
      const nextSize = getPageSize();
      setPageSize(nextSize);
      setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(hotels.length / nextSize))));
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, [hotels.length]);

  const totalPages = Math.max(1, Math.ceil(hotels.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleHotels = hotels.slice((safePage - 1) * pageSize, safePage * pageSize);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages || page === safePage) return;

    setCurrentPage(page);
    cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (pageSize !== 1) return;
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (pageSize !== 1 || !start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    if (event.cancelable) event.preventDefault();
    suppressClick.current = true;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 350);
    changePage(safePage + (deltaX < 0 ? 1 : -1));
  };

  return (
    <section id="tour-hotels" className="mb-[125px] scroll-mt-24 xl:mb-[180px]">
      <Container>
        <HotelsTitle listMode />
        <div
          ref={cardsRef}
          aria-live="polite"
          className="grid scroll-mt-24 touch-pan-y grid-cols-1 gap-5 md:touch-auto md:grid-cols-2 xl:grid-cols-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {visibleHotels.map((hotel, index) => (
            <HotelCard
              key={`${hotel.title}-${(safePage - 1) * pageSize + index}`}
              hotel={hotel}
              onDetails={() => {
                if (suppressClick.current) return;
                setSelectedHotel(hotel);
                setIsPopUpShown(true);
              }}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Сторінки готелів"
            className="mt-12 flex items-center justify-center gap-6"
          >
            <button
              type="button"
              aria-label="Попередня сторінка готелів"
              disabled={safePage === 1}
              onClick={() => changePage(safePage - 1)}
              className="flex size-[42px] items-center justify-center rounded-lg bg-main text-white shadow-pagination transition-colors enabled:cursor-pointer enabled:hover:brightness-110 disabled:bg-white disabled:text-black disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-main"
            >
              <ArrowInCircleIcon className="size-6 rotate-180" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  aria-label={`Сторінка готелів ${page}`}
                  aria-current={page === safePage ? "page" : undefined}
                  onClick={() => changePage(page)}
                  className={`size-8 cursor-pointer rounded-md text-[16px] focus-visible:outline-2 focus-visible:outline-main ${page === safePage ? "font-semibold text-main" : "text-black hover:text-main"}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Наступна сторінка готелів"
              disabled={safePage === totalPages}
              onClick={() => changePage(safePage + 1)}
              className="flex size-[42px] items-center justify-center rounded-lg bg-main text-white shadow-pagination transition-colors enabled:cursor-pointer enabled:hover:brightness-110 disabled:bg-white disabled:text-black disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-main"
            >
              <ArrowInCircleIcon className="size-6" />
            </button>
          </nav>
        )}

        <HotelModal
          isPopUpShown={isPopUpShown}
          setIsPopUpShown={setIsPopUpShown}
          title={selectedHotel.title}
        >
          <HotelModalContent
            title={selectedHotel.title}
            stars={selectedHotel.stars}
            description={selectedHotel.fullDescription}
            gallery={
              selectedHotel.galleryVariants?.map((item) => item.modal) ?? selectedHotel.gallery
            }
          />
        </HotelModal>
      </Container>
    </section>
  );
}
