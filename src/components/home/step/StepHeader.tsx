import Image from "next/image";

const StepHeader = ()=> {
    return (
        <div className="flex gap-x-[14px] items-center py-6 px-7 mt-[13px] lg:mt-[36px] mb-[28px] lg:mb-[32px] bg-red">
        <Image
            src="/images/home/step/step.webp"
    alt="background"
    width={174}
    height={174}
    className="size-[69px] xl:size-[87px]"
    />
    <div className="flex flex-col justify-between text-white">
    <p className="mb-[10px] xl:mb-1 text-12med xl:text-14med">
        STORY TRAVEL EMOTIONS PHOTO
    </p>
    <h2 className="text-24bold xl:text-32bold">S.T.E.P</h2>
        </div>
        </div>
    )
}

export default StepHeader;
