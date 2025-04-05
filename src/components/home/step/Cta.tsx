import Image from "next/image";
import { STEP_URL } from "@/constants/constants";
import MainButton from "@/components/shared/buttons/MainButton";

export default function Cta() {
  return (
    <div className="md:flex flex-col justify-between md:w-[40.6%] border-[1.5px] border-main rounded-[12px] overflow-hidden">
      <div className="flex gap-x-[14px] items-center py-6 px-7 bg-red">
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
      <div className="sm:flex md:flex-col gap-x-5 items-center md:items-start px-7 md:px-6 lg:px-7 py-7">
        <p className="max-w-[240px]  md:max-w-[328px] mb-[22px] sm:mb-0 md:mb-[22px] mx-auto sm:mx-0 text-18med text-center sm:text-left">
          Мрієте про ідеальну подорож? Ми допоможемо!
        </p>
        <a href={STEP_URL} target="_blank" rel="noopener noreferrer">
          <MainButton
            variant="ghost red"
            className="block w-[240px] xl:w-[210px] h-12 mx-auto sm:mx-0 text-14med"
          >
            Переглянути тур
          </MainButton>
        </a>
      </div>
    </div>
  );
}
