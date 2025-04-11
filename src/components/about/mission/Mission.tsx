import Image from "next/image";
import { mission } from "./mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import AnimatedArrowMob from "./AnimatedArrowMob";
import AnimatedArrowDesk from "./AnimatedArrowDesk";

export default function Mission() {
  if (!mission) {
    return null;
  }

  const { title, description, content } = mission;
  const { partOne, partTwo } = content;

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="relative">
        <AnimatedArrowMob />
        <AnimatedArrowDesk />
        <AnimatedWrapper
          as="h2"
          animation={fadeInAnimation({ x: -30 })}
          className="mb-4 text-center text-36med xl:text-40med"
        >
          {title}
        </AnimatedWrapper>
        <AnimatedWrapper
          as="p"
          animation={fadeInAnimation({ x: 30 })}
          className="max-w-[301px] xl:max-w-[353px] mx-auto mb-[60px] xl:mb-16 text-16reg xl:text-18reg text-center"
        >
          {description}
        </AnimatedWrapper>
        <div className="flex flex-col md:flex-row gap-x-5 gap-y-12">
          <div className="md:w-[45%] xl:w-[40.6%]">
            <AnimatedWrapper
              as="p"
              animation={fadeInAnimation({ x: -30, delay: 0.4 })}
              className="mb-8"
            >
              {partOne?.text}
            </AnimatedWrapper>
            <AnimatedWrapper
              animation={fadeInAnimation({ x: -30, delay: 0.4 })}
              className="relative w-full h-[184px] rounded-[12px] overflow-hidden"
            >
              <Image
                src={partOne?.image?.url}
                alt={partOne?.image?.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </AnimatedWrapper>
          </div>
          <div className="flex flex-col md:flex-col-reverse gap-y-8 md:w-[53.2%] xl:w-[57.6%]">
            <AnimatedWrapper
              as="p"
              animation={fadeInAnimation({ x: 30, delay: 0.4 })}
              className="lg:max-w-[478px]"
            >
              {partTwo?.text}
            </AnimatedWrapper>
            <AnimatedWrapper
              animation={fadeInAnimation({ x: 30, delay: 0.4 })}
              className="relative w-full h-[222px] rounded-[12px] overflow-hidden"
            >
              <Image
                src={partTwo?.image?.url}
                alt={partTwo?.image?.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-right md:object-[center_22%]"
              />
            </AnimatedWrapper>
          </div>
        </div>
      </Container>
    </section>
  );
}
