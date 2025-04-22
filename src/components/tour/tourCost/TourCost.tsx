import { Tour } from "@/types/tour";
import Image from "next/image";
import Calendar from "./Calendar";
import Container from "@/components/shared/container/Container";

interface TourCostProps {
  tour: Tour;
}

export default function TourCost({ tour }: TourCostProps) {
  const { images } = tour;

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="md:flex items-end gap-x-10">
        <div className="hidden md:block md:w-[calc(33.3%-26.67px)]">
          <h2 className="mb-5 text-40med">Вартість туру</h2>
          <p className="mb-[30px] text-16reg">
            Можете переглянути вільні дати для цього тура та обрати підходящий
            формат для себе
          </p>
          {images[3] ? (
            <div className="relative h-[544px] rounded-[12px] overflow-hidden">
              <Image
                src={images[3].url}
                alt={images[3].alt}
                fill
                sizes="30vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
        <Calendar />
        {images[4] ? (
          <div className="hidden md:block relative md:w-[calc(33.3%-26.67px)] h-[702px] rounded-[12px] overflow-hidden">
            <Image
              src={images[4].url}
              alt={images[4].alt}
              fill
              sizes="30vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
