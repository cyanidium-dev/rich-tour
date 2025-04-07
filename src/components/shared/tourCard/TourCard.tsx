import { Tour } from "@/types/tour";
import Image from "next/image";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const { title, description, mainImage } = tour;

  return (
    <div className="rounded-[12px] overflow-hidden">
      <div className="relative aspect-[210/129] xl:aspect-[265/170]">
        <Image src={mainImage?.url} alt="background" fill />
      </div>
    </div>
  );
}
