import Image from "next/image";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { TourBenefitListItem } from "@/types/tour";

interface BenefitsListItemProps {
  listItem: TourBenefitListItem;
}

export default function BenefitsListItem({ listItem }: BenefitsListItemProps) {
  const { text, sublist } = listItem;

  return (
    <AnimatedListItem>
      <div className="flex gap-x-5 items-center">
        <AnimatedWrapper
          animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
          className="size-[18px] bg-main rounded-full"
        ></AnimatedWrapper>
        <p className="max-w-[calc(100%-18px-20px)] xl:max-w-[calc(100%-24px-20px] text-20med">
          {text}
        </p>
      </div>
      {!sublist || !sublist.length ? null : (
        <ul className="flex flex-col gap-y-2 pl-[37px] xl:pl-[44px] mt-5">
          {sublist.map((sublistItem, idx) => (
            <li key={idx} className="flex gap-x-3 items-center">
              <Image
                src="/images/tour/benefits/arrow.svg"
                alt="arrow"
                width="22"
                height="12"
              />

              <p>{sublistItem}</p>
            </li>
          ))}
        </ul>
      )}
    </AnimatedListItem>
  );
}
