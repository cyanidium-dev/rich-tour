import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";

export default function DocumentsTitle() {
  return (
    <div className="mb-[54px] xl:mb-12 flex justify-center items-center gap-x-5 md:gap-x-10 w-screen text-white">
      <div className="relative w-[calc(50%-42px)] md:w-[calc(50%-62px)] xl:w-[calc(50%-65px)] h-[3px] bg-white">
        <ArrowHeadIcon className="absolute top-[-10px] right-[-4px] rotate-180" />
      </div>
      <h2 className="text-36med xl:text-40med">Документи</h2>
      <div className="relative w-[calc(50%-42px)] md:w-[calc(50%-62px)] xl:w-[calc(50%-65px)] h-[3px] bg-white">
        <ArrowHeadIcon className="absolute top-[-10px] left-[-4px]" />
      </div>
    </div>
  );
}
