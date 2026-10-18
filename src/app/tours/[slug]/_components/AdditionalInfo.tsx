import Image from "next/image";

import { Container } from "@/shared/ui/index";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import styles from "./AdditionalInfo.module.css";

export default function AdditionalInfo({ text }: { text: string }) {
  const items = text
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="mb-[148px] xl:mb-[180px] relative">
      <Container className="md:flex md:justify-end">
        <Image
          alt="additional info arrow"
          width={648}
          height={173}
          className="hidden md:block absolute top-[-35px] left-[-12px] z-20 w-[648px] h-[173px]"
          src="/images/addional-info-arrow-desk.svg"
        />
        <Image
          alt="additional info arrow"
          width={152}
          height={222}
          className="md:hidden absolute top-[-30px] right-[0px] z-20"
          src="/images/addional-info-arrow-mob.svg"
        />
        {/*<AnimatedArrowDesk />*/}
        <div className="max-w-[480px]">
          <AnimatedWrapper
            as="h2"
            animation={fadeInAnimation({ y: 30 })}
            className="mb-5 text-40med"
          >
            Додаткова інформація
          </AnimatedWrapper>
          <AnimatedWrapper
            as="ul"
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            className={styles.list}
          >
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </AnimatedWrapper>
        </div>
      </Container>
    </section>
  );
}
