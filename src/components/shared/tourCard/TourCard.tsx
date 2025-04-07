import { Tour } from "@/types/tour";
import Image from "next/image";
import Link from "next/link";
import SecondaryButton from "../buttons/SecondaryButton";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const { title, description, mainImage, duration, slug } = tour;

  return (
    <Link
      href={`/tours/${slug}`}
      className="block relative max-w-[210px] md:max-w-[226px] lg:max-w-[228px] xl:max-w-[265px] rounded-[12px] overflow-hidden shadow-card"
    >
      <div className="absolute -z-10 top-0 left-0 w-full aspect-[210/129] xl:aspect-[265/170]">
        <Image
          src={mainImage?.url}
          alt={mainImage?.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="px-4 py-7 mt-[105px] xl:mt-[139px] rounded-[12px] bg-white">
        <h3 className="mb-[19px] text-16semi xl:text-20semi line-clamp-1">
          {title}
        </h3>
        <p className="mb-[14px] xl:mb-[22px] text-12light">{description}</p>
        <p className="mb-[14px] xl:mb-[22px] text-12semi xl:text-14semi">
          {duration}&nbsp;днів
        </p>
        <SecondaryButton>Детальніше</SecondaryButton>
      </div>
    </Link>
  );
}
