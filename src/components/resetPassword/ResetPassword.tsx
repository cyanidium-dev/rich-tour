import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "../shared/container/Container";
import ResetPasswordFormWithNotifications from "./ResetPasswordFormWithNotifications";

export default function ResetPassword() {
  return (
    <section className="mt-[18px] mb-[148px] xl:mb-[180px]">
      <Container>
        <div className="max-w-[740px] pt-[120px] pb-[178px] xl:py-[74px] sm:px-8 mx-auto sm:border border-black rounded-[16px]">
          <AnimatedWrapper
            as="h1"
            animation={fadeInAnimation({ y: 30 })}
            className="mb-6 text-24semi text-center"
          >
            Відновлення паролю
          </AnimatedWrapper>
          <AnimatedWrapper
            as="p"
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            className="max-w-[197px] mb-6 mx-auto text-14reg text-center"
          >
            Вкажіть новий пароль для свого кабінету.
          </AnimatedWrapper>
          <ResetPasswordFormWithNotifications />
        </div>
      </Container>
    </section>
  );
}
