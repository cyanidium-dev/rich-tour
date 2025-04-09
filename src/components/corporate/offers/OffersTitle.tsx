import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";

export default function OffersTitle() {
  return (
    <div className="mb-16 xl:mb-[43px] flex justify-center items-center gap-x-7 xl:gap-x-12 w-screen">
      <div className="relative w-[calc(50%-142px)] xl:w-[calc(50%-267px)] h-[3px] bg-black">
        <ArrowHeadIcon className="absolute top-[-10px] right-[-4px] rotate-180" />
      </div>
      <h2 className="max-w-[228px] xl:max-w-[438px] text-32med xl:text-40med text-center">
        Що ми пропонуємо?
      </h2>
      <div className="relative w-[calc(50%-142px)] xl:w-[calc(50%-267px)] h-[3px] bg-black">
        <ArrowHeadIcon className="absolute top-[-10px] left-[-4px]" />
      </div>
    </div>
  );
}
