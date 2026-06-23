"use client";

import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import AnimatedScribbleArrow from "@/components/agent/menu/content/AnimatedScribbleArrow";

export default function AgencyHero() {
    return (
        <section className="relative">
            <Container className="relative pt-[40px] xl:pt-[40px] pb-[72px] xl:pb-[70px]">
                <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_480px] items-center gap-y-[32px] lg:gap-x-10">
                    <AnimatedWrapper
                        as="h1"
                        animation={fadeInAnimation({ x: -30 })}
                        className="text-32med xl:text-48med uppercase text-left"
                    >
                        Кабінет агенції
                    </AnimatedWrapper>
                    <AnimatedScribbleArrow />

                    <AnimatedWrapper
                        as="p"
                        animation={fadeInAnimation({ x: 30, delay: 0.4 })}
                        className="text-left justify-self-end"
                    >
                        <span className="block text-16semi">Вітаємо в кабінеті агентства!</span>
                        Керуйте заявками, переглядайте роботу агентів та відстежуйте статуси бронювань.
                    </AnimatedWrapper>
                </div>
            </Container>
        </section>
    );
}
