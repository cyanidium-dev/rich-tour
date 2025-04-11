import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import FaqList from "./FaqList";

export default function Faq() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container>
        <AnimatedWrapper
          as="h2"
          animation={fadeInAnimation({ y: 30 })}
          className="mb-10 text-36med xl:text-48med text-center"
        >
          Часто задавані питання
        </AnimatedWrapper>
        <FaqList />
      </Container>
    </section>
  );
}
