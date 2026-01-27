// import Image from "next/image";
// import { email } from "@/components/shared/footer/mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import MainButton from "@/components/shared/buttons/MainButton";
import client from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

type SiteSettings = {
  agentContract?: { asset?: { url?: string } };
  touristContract?: { asset?: { url?: string } };
  telegram?: string;
};

export default async function AgentContract() {
  const data: SiteSettings = await client.fetch(siteSettingsQuery);

  const agentUrl = data?.agentContract?.asset?.url;
  const touristUrl = data?.touristContract?.asset?.url;
  const telegramUrl = data?.telegram;

  return (
    <section className="mb-[148px] xl:mb-[86px]">
      <Container className="flex flex-col md:flex-row gap-x-5 gap-y-7">
        <div className="md:flex flex-col justify-between md:w-[calc(60%-10px)] gap-x-5">
          <div>
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30 })}
              as="h2"
              className="mb-5 xl:mb-7 text-32med xl:text-48med"
            >
              Необхідна інформація
            </AnimatedWrapper>
            <AnimatedWrapper
              animation={fadeInAnimation({ y: 30, delay: 0.4 })}
              as="p"
              className="mb-9 md:mb-0"
            >
              Для співпраці потрібно підписати договір. Агентський договір та зразок договору з туристом можна завантажити нижче. Підписати договір також можна через систему  "Вчасно". (для підписання договору через "Вчасно" напишіть запит на пошту richtourfamily@gmail.com для присвоєння номеру договору)
            </AnimatedWrapper>
          </div>
        </div>
        <div className="md:w-[calc(40%-10px)]">
          <AnimatedWrapper
              animation={fadeInAnimation({x: 30})}
              viewport={{once: true, amount: 0.8}}
          >
            <a
                href={agentUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block mb-3 mx-auto md:mx-0"
            >
              <MainButton className="w-full max-w-[550px] h-14 mx-auto md:mx-0 text-14med">
                Переглянути договір агента
              </MainButton>
            </a>
            <a
                href={touristUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block mb-3"
            >
              <MainButton
                  variant="ghost red"
                  className="w-full max-w-[550px] h-14 mx-auto md:mx-0 text-14med"
              >
                Переглянути договір з туристом
              </MainButton>
            </a>
            <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block md:mb-3"
            >
              <MainButton
                  variant="ghost red"
                  className="w-full max-w-[550px] h-14 mx-auto md:mx-0 text-14med"
              >
                Доєднатися до телеграм каналу
              </MainButton>
            </a>
          </AnimatedWrapper>
        </div>
      </Container>
    </section>
  );
}
