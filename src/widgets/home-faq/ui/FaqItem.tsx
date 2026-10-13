"use client";
import { useState } from "react";
import ArrowInCircleIcon from "@/components/shared/icons/ArrowInCircleIcon";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

interface FaqItemProps {
  faqItem: {
    title: string;
    text: string;
  };
}

export default function FaqItem({ faqItem }: FaqItemProps) {
  const [isShownMore, setIsShownMore] = useState(false);
  const toggleShowMore = () => setIsShownMore(!isShownMore);

  const { title, text } = faqItem;

  return (
    <AnimatedListItem
      onClick={toggleShowMore}
      className="cursor-pointer px-[27px] lg:px-10 py-[18px] laptop:px-[50px] rounded-[8px] shadow-card"
    >
      <div className={`flex items-center`}>
        <h3 className="max-w-[calc(100%-38px-12px)] text-14semi xl:text-20semi">{title}</h3>
        <ArrowInCircleIcon
          isShownMore={isShownMore}
          className={`${
            isShownMore ? "text-main" : "text-black"
          } block size-[38px] ml-auto xl:hover:text-main focus-visible:text-main transition duration-500 ease-in-out will-change-transform backface-hidden origin-center`}
        />
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-700 ${
          isShownMore ? "grid-rows-[1fr] ease-in" : "grid-rows-[0fr] ease-out"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="whitespace-pre-line pt-[18px] xl:pt-6">{text}</p>
        </div>
      </div>
    </AnimatedListItem>
  );
}
