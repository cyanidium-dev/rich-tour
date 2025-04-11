import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "../shared/container/Container";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import AnimatedArrow from "./AnimatedArrow";

export default function Reviews() {
  return (
    <section className="pt-9 md:pt-16 mb-[148px] xl:mb-[180px]">
      <Container className="relative">
        <AnimatedWrapper
          as="h1"
          animation={fadeInAnimation({ y: 30 })}
          className="mb-[78px] xl:mb-[53px] text-36med xl:text-48med text-center"
        >
          Відгуки
        </AnimatedWrapper>
        <AnimatedArrow />
        <div className="flex flex-col md:flex-row-reverse md:justify-between gap-y-16 md:gap-x-8 xl:gap-x-[115px]">
          <ReviewForm />
          <ReviewsList />
        </div>
      </Container>
    </section>
  );
}
