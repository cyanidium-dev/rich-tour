import { TourProgramListItem } from "@/types/tour";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

interface ProgramListItemProps {
  programItem: TourProgramListItem;
  idx: number;
}

export default function ProgramListItem({
  programItem,
  idx,
}: ProgramListItemProps) {
  const { description, sublist } = programItem;

  return (
    <li>
      <div className="h-[61px] py-2 px-4 md:px-[10px] mb-7 rounded-full bg-main">
        <p className="flex justify-center items-center w-full md:w-fit h-full px-9 rounded-full bg-white text-20semi">
          {idx + 1}&nbsp;день
        </p>
      </div>
      {description ? (
        <p className="mb-7 xl:mb-10 text-14reg xl:text-20reg">{description}</p>
      ) : null}
      {!sublist || !sublist.length ? null : (
        <ul className="flex flex-col gap-y-5 xl:gap-y-7">
          {sublist.map((sublistItem, idx) => (
            <li key={idx}>
              <div className="flex items-center gap-x-5">
                <AnimatedWrapper
                  animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
                  className="size-[18px] xl:size-6 bg-main rounded-full"
                ></AnimatedWrapper>
                <p className="max-w-[calc(100%-18px-20px)] xl:max-w-[calc(100%-24px-20px] text-20med">
                  {sublistItem?.title}
                </p>
              </div>
              {sublistItem?.description ? (
                <p className="pl-[38px] xl:pl-[44px] mt-3 text-14reg xl:text-16reg">
                  {sublistItem?.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
