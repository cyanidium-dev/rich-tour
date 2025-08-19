import Link from "next/link";
import Image from "next/image";
import {connection} from "next/server";

import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import MainButton from "@/components/shared/buttons/MainButton";
import Container from "@/components/shared/container/Container";
import ReviewsSwiperMob from "./ReviewsSwiperMob";
import ReviewsListDesk from "./ReviewsListDesk";
import AnimatedWrapper from "../animation/AnimatedWrapper";

import client from "../../../lib/sanity";
import {lastReviewsQuery} from "@/lib/queries";


export default async function Reviews() {
  await connection();
  const reviews = await client.fetch(lastReviewsQuery);

  return (
    <section className="mb-[68px] md:mb-[180px]">
      <Container className="md:flex gap-x-5">
        <div className="md:w-[65.4%]">
          <div className="md:flex items-center gap-x-[42px] md:gap-x-7 lg:gap-x-[42px] mb-8">
            <AnimatedWrapper
              animation={fadeInAnimation({ x: -30 })}
              className="flex items-center gap-x-[42px] md:gap-x-7 lg:gap-x-[42px]"
            >
              <h2 className="mb-5 xl:mb-8 text-40med md:text-32med xl:text-48med">
                Відгуки
              </h2>
              <Image
                src="/images/home/reviews/arrow.svg"
                alt="arrow"
                width="81"
                height="15"
                className="w-[81px] md:w-[50px] lg:w-[81px] h-auto mb-4 xl:mb-6"
              />
            </AnimatedWrapper>
            <AnimatedWrapper
              animation={fadeInAnimation({ x: 30 })}
              as="p"
              className="md:max-w-[185px] xl:max-w-[265px] md:mb-4 xl:mb-6 text-16med xl:text-20med"
            >
              Що кажуть наші клієнти про SMART тури?
            </AnimatedWrapper>
          </div>
          <AnimatedWrapper
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            as="p"
            className="xl:max-w-[550px] mb-[52px] xl:mb-8"
          >
            Ми пишаємося тим, що наші клієнти залишаються задоволеними своїми
            подорожами. Читайте відгуки реальних людей, які вже скористалися
            нашими послугами, і переконайтеся, що ваш відпочинок у надійних
            руках!
          </AnimatedWrapper>
          <AnimatedWrapper
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            className="w-full max-w-[325px] md:max-w-[265px]"
          >
            <Link href="/reviews">
              <MainButton className="w-full h-12 text-14med">
                Переглянути всі відгуки
              </MainButton>
            </Link>
          </AnimatedWrapper>
        </div>
        <AnimatedWrapper
          animation={fadeInAnimation({ y: 30, delay: 0.4 })}
          className="hidden md:block relative md:w-[40.6%] aspect-[325/217] mt-9 md:mt-0 rounded-[12px] overflow-hidden"
        >
          <Image
            src="/images/home/reviews/balloons.webp"
            alt="balloons"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </AnimatedWrapper>
      </Container>
      <ReviewsSwiperMob items={reviews} />
      <Container>
        <AnimatedWrapper
          animation={fadeInAnimation({ y: 30, delay: 0.4 })}
          className="md:hidden relative aspect-[325/217] mt-9 rounded-[12px] overflow-hidden"
        >
          <Image
            src="/images/home/reviews/balloons.webp"
            alt="balloons"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </AnimatedWrapper>
        <ReviewsListDesk items={reviews} />
      </Container>
    </section>
  );
}
