import Image from "next/image";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

export default function OffersListMob() {
  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="flex md:hidden flex-col gap-y-5 text-20med xl:text-24med text-white"
    >
      <AnimatedListItem className="relative flex items-end w-full h-[448px] p-[26px] rounded-[12px] overflow-hidden">
        <Image
          src="/images/corporate/offers/imageOneMob.webp"
          alt="background"
          fill
          sizes="100vw"
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <div className="absolute -z-10 bottom-[-162px] left-[-50px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
        <p className="max-w-[194px]">Корпоративні тури та тимбілдинги</p>
      </AnimatedListItem>
      <AnimatedListItem className="relative flex items-end w-full h-[194px] p-[26px] rounded-[12px] overflow-hidden">
        <Image
          src="/images/corporate/offers/imageTwoMob.webp"
          alt="background"
          fill
          sizes="100vw"
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <p className="max-w-[200px]">Участь у виставках та конференціях</p>
      </AnimatedListItem>
      <AnimatedListItem className="relative w-full h-[264px] p-[26px] rounded-[12px] overflow-hidden">
        <Image
          src="/images/corporate/offers/imageThreeMob.webp"
          alt="background"
          fill
          sizes="100vw"
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <div className="absolute -z-10 top-[-168px] left-[-76px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
        <p className="max-w-[158px]">Організація ділових подорожей</p>
      </AnimatedListItem>
      <AnimatedListItem className="relative flex items-end w-full h-[264px] p-[26px] rounded-[12px] overflow-hidden">
        <Image
          src="/images/corporate/offers/imageFourMob.webp"
          alt="background"
          fill
          sizes="100vw"
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <p className="max-w-[167px]">Індивідуальний підхід</p>
      </AnimatedListItem>
    </AnimatedWrapper>
  );
}
