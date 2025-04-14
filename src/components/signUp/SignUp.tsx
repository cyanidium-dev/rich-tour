import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "../shared/container/Container";
import SignUpFormWithNotifications from "./SignUpFormWithNotifications";

export default function SignUp() {
  return (
    <section className="mt-[18px] mb-[148px] xl:mb-[180px]">
      <Container>
        <AnimatedWrapper
          className="max-w-[740px] pt-[116px] md:py-20 sm:px-8 mx-auto md:border border-black
         rounded-[16px]"
        >
          <AnimatedWrapper
            as="h1"
            animation={fadeInAnimation({ y: 30 })}
            className="mb-6 text-24semi text-center"
          >
            Реєстрація агента
          </AnimatedWrapper>
          <SignUpFormWithNotifications />
        </AnimatedWrapper>
      </Container>
    </section>
  );
}
