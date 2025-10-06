import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

interface PointItemProps {
  point: string;
  idx: number;
}

export default function PointItem({ point, idx }: PointItemProps) {
  const isEven = idx % 2 === 0;

  return (
    <AnimatedListItem className={`relative flex flex-col items-center w-fit`}>
      {/* Текст над або під кружечком */}
      <div
        className={`
          xl:absolute mb-[14px]
          ${isEven ? "xl:bottom-full  xl:mb-[14px]" : "xl:top-full xl:mt-[14px]"}
        `}
      >
        <p className="py-2 px-8 xl:px-5 rounded-full border border-black bg-white text-18reg xl:text-12reg whitespace-nowrap">
          {point}
        </p>
      </div>

      {/* Кружечок на лінії */}
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9 })}
        className="size-4 rounded-full bg-main z-10"
      />
    </AnimatedListItem>
  );
}
