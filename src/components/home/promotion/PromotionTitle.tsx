import ArrowHeadIcon from "@/components/shared/icons/ArrowHeadIcon";

export default function PromotionTitle() {
  return (
    <div className="relative flex">
      <h2 className="max-w-[210px] md:max-w-full mb-[35px] xl:mb-[60px] text-36med xl:text-48med text-main">
        Акційні пропозиції
      </h2>
      <div className="flex absolute top-3 xl:top-5 left-[180px] md:left-[435px] xl:left-[566px] w-screen text-black">
        <ArrowHeadIcon />
        <div className="absolute w-full h-[3px] top-[9.5px] left-[2px] bg-black"></div>
      </div>
    </div>
  );
}
