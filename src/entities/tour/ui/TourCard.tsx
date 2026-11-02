import Image from "next/image";
import Link from "next/link";
import { getDayWord } from "@/shared/lib";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import type { TourShortInfo } from "../model/types";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { SecondaryButton } from "@/shared/ui";
import { tourImageUrl } from "../model/tourImageUrl";

interface TourCardProps {
  tour: TourShortInfo;
}

export default function TourCard({ tour }: TourCardProps) {
  const { title, description, image, duration, slug, category, isOnPromo, earlyBooking } = tour;

  const showPromotion = isOnPromo || category?.value === "promotion";

  return (
    <Link
      href={`/tours/${slug.current}`}
      className="block relative min-h-full rounded-[12px] overflow-hidden shadow-card"
    >
      <div className="absolute -z-10 top-0 left-0 w-full aspect-[210/129] xl:aspect-[265/170]">
        <div className="absolute top-5 xl:top-[18px] left-4 xl:left-auto xl:right-[18px] z-10 flex flex-col items-start xl:items-end gap-2">
          {[
            ...(showPromotion ? ["Акція!"] : []),
            ...(earlyBooking ? ["Раннє бронювання"] : []),
          ].map((label) => (
            <AnimatedWrapper
              key={label}
              animation={fadeInAnimation({ scale: 0.9, delay: 0.4 })}
              className="min-w-[96px] px-4 h-9 flex items-center justify-center rounded-full bg-main bg-opacity-[66%] text-12med text-white"
            >
              {label}
            </AnimatedWrapper>
          ))}
        </div>
        <picture>
          <source media="(max-width: 1279px)" srcSet={tourImageUrl(image, "cardMobile")} />
          <Image
            src={tourImageUrl(image, "cardDesktop") || ""}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </picture>
      </div>
      <div className="px-4 py-7 xl:py-[30px] mt-[105px] xl:mt-[139px] rounded-[12px] bg-white">
        <h3 className="mb-[19px] text-16semi xl:text-20semi line-clamp-1">{title}</h3>
        <p className="min-h-[74px] mb-[14px] xl:mb-[22px] text-12light line-clamp-5">
          {description}
        </p>
        <p className="mb-[14px] xl:mb-[22px] text-12semi xl:text-14semi">
          {duration}&nbsp;{getDayWord(duration)}
        </p>
        <SecondaryButton>Детальніше</SecondaryButton>
      </div>
    </Link>
  );
}
