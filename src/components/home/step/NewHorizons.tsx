import Image from "next/image";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

export default function NewHorizons() {
  return (
    <AnimatedWrapper
      animation={fadeInAnimation({ y: 30 })}
      className="relative md:w-[50%] rounded-[12px] overflow-hidden text-white"
    >
      <Image
        src="/images/home/step/newHorizons.webp"
        alt="background"
        width={1290}
        height={768}
        className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
      />
      <div className="py-[44px] px-8 xl:px-10">
        <h3 className="mb-[201px] xl:mb-[189px] text-32med text-center sm:text-left">
          Нові горизонти
        </h3>
        <p className="max-w-[266px] text-14reg text-center sm:text-left mx-auto sm:mx-0">
          Вирушайте у подорож до Швейцарії – країни неймовірних пейзажів,
          бездоганного сервісу та справжнього затишку!
        </p>
      </div>
    </AnimatedWrapper>
  );
}
