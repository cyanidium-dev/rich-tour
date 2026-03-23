"use client";

import {useState} from "react";

import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";

import NotificationPopUp from "@/components/shared/pop-ups/NotificationPopUp";
import Backdrop from "@/components/shared/backdrop/Backdrop";

import AnimatedScribbleArrow from "@/components/agent/menu/content/AnimatedScribbleArrow";

export default function Hero({existProperties}: {existProperties: string[]}) {
    const [isNotificationShown, setIsNotificationShown] = useState(Boolean(existProperties.length));

    return (
        <section className="relative">
            <NotificationPopUp
                title={"Не вся інформація заповнена"}
                description={`Заповніть будь ласка цю інформацію в налаштуваннях: ${existProperties.join(", ")}`}
                isPopUpShown={isNotificationShown}
                setIsPopUpShown={setIsNotificationShown}
            />
            <Backdrop
                isVisible={isNotificationShown}
                onClick={() => setIsNotificationShown(false)}
            />
            <Container className="relative pt-[40px] xl:pt-[40px] pb-[100px] xl:pb-[86px]">
                <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_480px] items-center gap-y-[32px] lg:gap-x-10">
                    <AnimatedWrapper
                        as="h1"
                        animation={fadeInAnimation({ x: -30 })}
                        className="text-32med xl:text-48med uppercase text-left"
                    >
                        Кабінет агента
                    </AnimatedWrapper>
                    <AnimatedScribbleArrow />

                    <AnimatedWrapper
                        as="p"
                        animation={fadeInAnimation({ x: 30, delay: 0.4 })}
                        className="text-left justify-self-end"
                    >
                        Шановні партнери, тут вказана коротка інформація про наші тури та Вашу
                        комісію. Обирайте тур, який зацікавив Вас та Ваших клієнтів, щоб
                        детальніше ознайомитись з описом і програмою туру. Вдалих продажів!
                    </AnimatedWrapper>
                </div>
            </Container>
        </section>
    );
}
