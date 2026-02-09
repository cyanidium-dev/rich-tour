import Image from "next/image";
import Link from "next/link";
import { getDayWord } from "@/utils/getDayWord";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import { TourShortInfo } from "@/types/tour";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import SecondaryButton from "../../buttons/SecondaryButton";

interface TourCardProps {
  tour: TourShortInfo;
}

export default function TourCard({ tour }: TourCardProps) {
  const { title, description, image, duration, slug, category } =
    tour;

  const isOnPromo = category?.value === "promotion";
  const earlyBooking = false;

  return (
    <Link
      href={`/tours/${slug.current}`}
      className="block relative min-h-full rounded-[12px] overflow-hidden shadow-card"
    >
      <div className="absolute -z-10 top-0 left-0 w-full aspect-[210/129] xl:aspect-[265/170]">
        <AnimatedWrapper
          animation={fadeInAnimation({ scale: 0.9, delay: 0.4 })}
          className={`${
            isOnPromo ? "block" : "hidden"
          } absolute top-5 xl:top-[18px] left-4 xl:left-auto xl:right-[18px] z-10 w-[96px] h-9 flex items-center justify-center 
          rounded-full bg-main bg-opacity-[66%] text-12med text-white`}
        >
          Акція!
        </AnimatedWrapper>
        <AnimatedWrapper
          animation={fadeInAnimation({ scale: 0.9, delay: 0.4 })}
          className={`${
            earlyBooking && !isOnPromo ? "block" : "hidden"
          } absolute top-5 xl:top-[18px] left-4 xl:left-auto xl:right-[18px] z-10 w-[164px] h-9 flex items-center justify-center 
          rounded-full border-[1.5px] border-main bg-black bg-opacity-[27%] text-12med text-white`}
        >
          Раннє бронювання
        </AnimatedWrapper>
        <Image
          src={image?.asset?.url}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="px-4 py-7 xl:py-[30px] mt-[105px] xl:mt-[139px] rounded-[12px] bg-white">
        <h3 className="mb-[19px] text-16semi xl:text-20semi line-clamp-1">
          {title}
        </h3>
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
