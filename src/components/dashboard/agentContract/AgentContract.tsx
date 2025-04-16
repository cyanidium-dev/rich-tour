import Image from "next/image";
import { email } from "@/components/shared/footer/mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import MainButton from "@/components/shared/buttons/MainButton";

export default function AgentContract() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="flex flex-col md:flex-row gap-x-5 gap-y-7">
        <div className="md:flex flex-col justify-between md:w-[calc(50%-10px)]">
          <div>
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30 })}
              as="h2"
              className="mb-5 xl:mb-7 text-32med xl:text-48med"
            >
              Договір агента
            </AnimatedWrapper>
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30, delay: 0.4 })}
              as="p"
              className="mb-9 md:mb-0"
            >
              Для співпраці потрібно підписати договір. Агентський договір та
              зразок договору з туристом можна завантажити нижче. Підписати
              договір також можна через систему  &ldquo;Вчасно&ldquo;. (для
              підписання договору через &ldquo;Вчасно&ldquo; напишіть запит на
              пошту{" "}
              <a
                href={`mailto:${email}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className=" xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
                aria-label="email"
              >
                {email}
              </a>{" "}
              для присвоєння номеру договору).
            </AnimatedWrapper>
          </div>
          <AnimatedWrapper
            animation={fadeInAnimation({ y: 30, delay: 0.8 })}
            className="relative h-[188px] overflow-hidden rounded-[12px]"
          >
            <Image
              src="/images/dashboard/agentContract/imageOne.webp"
              alt="background"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="absolute top-0 left-0 object-cover"
            />
          </AnimatedWrapper>
        </div>
        <div className="md:w-[calc(50%-10px)]">
          <AnimatedWrapper
            animation={fadeInAnimation({ x: 30 })}
            viewport={{ once: true, amount: 0.8 }}
          >
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block mb-3 mx-auto md:mx-0"
            >
              <MainButton className="w-full max-w-[550px] h-14 mx-auto md:mx-0 text-14med">
                Переглянути договір агента
              </MainButton>
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block md:mb-9"
            >
              <MainButton
                variant="ghost red"
                className="w-full max-w-[550px] h-14 mx-auto md:mx-0 text-14med"
              >
                Взірець договору з туристом
              </MainButton>
            </a>
          </AnimatedWrapper>
          <AnimatedWrapper
            animation={fadeInAnimation({ y: 30, delay: 0.8 })}
            className="hidden md:block relative h-[242px] overflow-hidden rounded-[12px]"
          >
            <Image
              src="/images/dashboard/agentContract/imageTwo.webp"
              alt="background"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="absolute top-0 left-0 object-cover"
            />
          </AnimatedWrapper>
        </div>
      </Container>
    </section>
  );
}
