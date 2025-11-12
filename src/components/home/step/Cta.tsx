// import Image from "next/image";
import { STEP_URL } from "@/constants/constants";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import MainButton from "@/components/shared/buttons/MainButton";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

export default function Cta() {
  return (
    <AnimatedWrapper
      animation={fadeInAnimation({ y: 30, delay: 0.4 })}
      className="md:flex flex-col justify-between md:w-[50%]  border-main rounded-[12px] overflow-hidden"
    >
      <div className="sm:flex md:flex-col gap-x-5 items-center md:items-start px-7 md:px-6 lg:px-7 py-7">
        <p className="mb-[22px] sm:mb-0 md:mb-[22px] mx-auto sm:mx-0 text-24med text-center sm:text-left">
          Мрієте про ідеальну подорож? Ми допоможемо!
        </p>
        <a href={STEP_URL} target="_blank" rel="noopener noreferrer">
          <MainButton
            variant="ghost red"
            className="block w-[240px] xl:w-[210px] h-12 mx-auto sm:mx-0 text-14med"
          >
            Переглянути тур
          </MainButton>
        </a>
      </div>
    </AnimatedWrapper>
  );
}
