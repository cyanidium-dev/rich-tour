import MainButton from "@/components/shared/buttons/MainButton";
import Container from "@/components/shared/container/Container";
import { Tour } from "@/types/tour";
import Link from "next/link";
import InspirationListMob from "./InspirationListMob";

interface InspirationProps {
  tour: Tour;
}

export default function Inspiration({ tour }: InspirationProps) {
  const { program, inspiration } = tour;

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container>
        <h2 className="mb-10 xl:mb-12 text-36med xl:text-40med text-center">
          Натхнення
        </h2>
      </Container>
      <InspirationListMob inspiration={inspiration} />
      <Container>
        <Link href={program?.url || ""}>
          <MainButton
            variant="black"
            className="w-full max-w-[346px] h-16 mx-auto"
          >
            Завантажити програму туру
          </MainButton>
        </Link>
      </Container>
    </section>
  );
}
