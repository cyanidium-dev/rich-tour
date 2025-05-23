import Link from "next/link";
import { Tour } from "@/types/tour";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import MainButton from "@/components/shared/buttons/MainButton";
import Container from "@/components/shared/container/Container";

import InspirationListMob from "./inspirationMob/InspirationListMob";
import InspirationListDesk from "./inspirationDesk/InspirationListDesk";
import AnimatedArrow from "./AnimatedArrow";

interface InspirationProps {
  tour: Tour;
}

export default function Inspiration({ tour }: InspirationProps) {
  const { program, inspiration } = tour;

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container>
        <AnimatedWrapper
          as="h2"
          animation={fadeInAnimation({ y: 30 })}
          className="mb-10 xl:mb-12 text-36med xl:text-40med text-center"
        >
          Натхнення
        </AnimatedWrapper>
      </Container>
      <InspirationListMob inspiration={inspiration} />
      <InspirationListDesk inspiration={inspiration} />
      <Container>
        <AnimatedWrapper
          animation={fadeInAnimation({ y: 30 })}
          className="relative w-full max-w-[346px] mx-auto"
        >
          <AnimatedArrow />
          <Link href={program?.url || ""}>
            <MainButton
              variant="black"
              className="w-full max-w-[346px] h-16 mx-auto"
            >
              Завантажити програму туру
            </MainButton>
          </Link>
        </AnimatedWrapper>
      </Container>
    </section>
  );
}
