
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";

export default function Hero() {
    return (
        <section className="relative ">
            <Container className="relative pt-[40px] xl:pt-[40px] pb-[59px] xl:pb-[86px]">
                <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_520px] items-center gap-y-10 lg:gap-x-10">
                    <AnimatedWrapper
                        as="h1"
                        animation={fadeInAnimation({ x: -30 })}
                        className="text-32med xl:text-48med uppercase text-left"
                    >
                        Кабінет агента
                    </AnimatedWrapper>

                    <AnimatedWrapper
                        as="p"
                        animation={fadeInAnimation({ x: 30, delay: 0.4 })}
                        className="max-w-[526px] text-left"
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
