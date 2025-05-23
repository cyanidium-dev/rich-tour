import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

interface PointItemProps {
  point: string;
}

export default function PointItem({ point }: PointItemProps) {
  return (
    <AnimatedListItem className="relative w-fit">
      <p className=" py-2 px-8 rounded-full border border-black bg-white text-18reg">
        {point}
      </p>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9 })}
        className="absolute bottom-[-30px] xl:bottom-[-34px] left-[calc(50%-8px)] size-4 rounded-full bg-main"
      ></AnimatedWrapper>
    </AnimatedListItem>
  );
}
