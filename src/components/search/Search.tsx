import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";
import SearchForm from "../shared/search/SearchForm";

export default function Search() {
  return (
    <section className="pt-[34px] xl:pt-[44px] mb-[148px] xl:mb-[180px]">
      <div className="md:flex justify-center items-center md:gap-x-[50px] w-screen">
        <AnimatedWrapper
          animation={fadeInAnimation({ x: -30, delay: 0.8 })}
          className="hidden md:block relative w-[calc(50%-325px)] h-[3px] bg-main"
        >
          <ArrowHeadIcon className="absolute top-[-10px] right-[-4px] rotate-180 text-main" />
        </AnimatedWrapper>
        <SearchForm variant="red" />
        <AnimatedWrapper
          animation={fadeInAnimation({ x: 30, delay: 0.8 })}
          className="hidden md:block relative w-[calc(50%-325px)] h-[3px] bg-main"
        >
          <ArrowHeadIcon className="absolute top-[-10px] left-[-4px] text-main" />
        </AnimatedWrapper>
      </div>
    </section>
  );
}
