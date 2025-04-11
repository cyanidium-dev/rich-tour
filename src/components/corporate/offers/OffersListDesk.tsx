import Image from "next/image";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

export default function OffersListDesk() {
  return (
    <div className="hidden md:flex gap-5">
      {/* Ліва колонка: велике зображення з круглим червоним блоком */}
      <AnimatedWrapper
        animation={fadeInAnimation({ x: -30, delay: 0.8 })}
        className="relative flex items-end w-[calc(33%-10px)] aspect-[360/484] p-5 lg:p-8 rounded-[12px] overflow-hidden"
      >
        <Image
          src="/images/corporate/offers/imageOneDesk.webp"
          alt="background"
          fill
          className="absolute top-0 left-0 -z-10 object-cover"
        />
        <p className="max-w-[194px] text-20med xl:text-24med text-white">
          Корпоративні тури та тімбілдинги
        </p>
        <div className="absolute -z-10 bottom-[-128px] left-[-38px] w-[270px] lg:w-[320px] aspect-[1/1] bg-main rounded-full"></div>
      </AnimatedWrapper>

      <div className="flex flex-col justify-between w-[calc(67%-10px)]">
        {/* Правий блок */}
        <AnimatedWrapper
          animation={fadeInAnimation({ x: 30, delay: 1.2 })}
          className="relative flex items-end aspect-[740/194] p-5 lg:p-8 rounded-[12px] overflow-hidden"
        >
          <Image
            src="/images/corporate/offers/imageTwoDesk.webp"
            alt="background"
            fill
            className="absolute top-0 left-0 -z-10 object-cover"
          />
          <p className="max-w-[332px] text-20med xl:text-24med text-white">
            Участь у виставках та конференціях
          </p>
        </AnimatedWrapper>

        <AnimatedWrapper
          animation={fadeInAnimation({ y: 30, delay: 1.6 })}
          className="flex gap-x-5"
        >
          {/* Нижній середній блок */}
          <div className="relative flex items-end aspect-[360/264] w-[calc(50%-10px)] p-5 lg:p-8 rounded-[12px] overflow-hidden">
            <Image
              src="/images/corporate/offers/imageFourDesk.webp"
              alt="background"
              fill
              className="absolute top-0 left-0 -z-10 object-cover"
            />
            <p className="max-w-[211px] text-20med xl:text-24med text-white">
              Індивідуальний підхід
            </p>
          </div>

          {/* Нижній правий блок з круглим червоним текстом */}
          <div className="relative aspect-[360/264] w-[calc(50%-10px)] p-5 lg:p-8 rounded-[12px] overflow-hidden">
            <Image
              src="/images/corporate/offers/imageThreeDesk.webp"
              alt="background"
              fill
              className="absolute top-0 left-0 -z-10 object-cover"
            />
            <div className="absolute -z-10 top-[-140px] left-[-56px] w-[270px] lg:w-[320px] aspect-[1/1] bg-main rounded-full"></div>
            <p className="max-w-[158px] text-20med xl:text-24med text-white">
              Організація ділових подорожей
            </p>
          </div>
        </AnimatedWrapper>
      </div>
    </div>
  );
}
