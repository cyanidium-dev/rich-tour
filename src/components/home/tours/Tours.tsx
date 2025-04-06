import Image from "next/image";
import Container from "@/components/shared/container/Container";
import ToursListMob from "./ToursListMob";

export default function Tours() {
  return (
    <section className="mb-[148px] xl:mb-[180px] pt-20">
      <Container className="relative md:flex gap-x-5">
        <Image
          src="/images/home/tours/arrowMob.svg"
          alt="arrow"
          width="179"
          height="156"
          className="md:hidden absolute top-[-72px] left-[136px] w-[170px] h-auto"
        />
        <Image
          src="/images/home/tours/arrowDesk.svg"
          alt="arrow"
          width="246"
          height="132"
          className="hidden md:block absolute top-[-78px] lg:top-[-104px] left-[calc(50%-222px)] lg:left-[calc(50%-322px)] md:w-[182px] lg:w-[246px] h-auto"
        />
        <div className="md:flex flex-col justify-between mb-10 md:mb-0 md:w-[calc(66.7%+13.3px)] min-h-full">
          <div className="md:flex flex-row-reverse justify-between ">
            <div className="md:w-[calc(50%-10px)]">
              <h2 className="mb-[14px] md:mb-[10px] text-36med xl:text-48med">
                Наші тури
              </h2>
              <p className="max-w-[198px] mb-[23px] md:mb-0 text-14med xl:text-16med">
                Мрієте про незабутню подорож?
              </p>
            </div>
            <p className="md:max-w-[265px] md:w-[calc(50%-10px)] lg:mt-[9px] md:text-12light lg:text-14light xl:text-16light">
              Ми створили тури для кожного, хто прагне відкрити світ: від
              романтичних прогулянок до захопливих пригод. Обирайте напрямок та
              вирушайте в подорож мрії!
            </p>
          </div>
          <div className="hidden md:flex gap-x-5 text-white">
            <div className="flex flex-col gap-y-5 md:w-[calc(50%-10px)]">
              <div className="flex items-end relative aspect-[360/178] px-[18px] py-5 rounded-[12px] overflow-hidden">
                <Image
                  src="/images/home/tours/bgFirstDesk.webp"
                  alt="background"
                  width={720}
                  height={356}
                  className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
                />
                <p className="max-w-[46.2%] text-20med lg:text-28med">
                  Тури Європою
                </p>
                <div className="absolute -z-10  bottom-[-230px] left-[-142px] lg:bottom-[-190px] lg:left-[-92px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
              </div>
              <div className="flex items-end justify-end relative aspect-[360/201] px-[18px] py-5 rounded-[12px] overflow-hidden">
                <Image
                  src="/images/home/tours/bgSecondDesk.webp"
                  alt="background"
                  width={720}
                  height={402}
                  className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
                />
                <p className="max-w-[76.2%] text-right text-20med lg:text-28med">
                  Під заказні групи
                </p>
              </div>
            </div>
            <div className="relative  md:w-[calc(50%-10px)] aspect-[360/399] px-[18px] py-5 rounded-[12px] overflow-hidden">
              <Image
                src="/images/home/tours/bgThirdDesk.webp"
                alt="background"
                width={720}
                height={798}
                className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
              />
              <p className="max-w-[69.2%] text-20med lg:text-28med">
                Львів для дітей
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-y-5 w-[calc(33.3%-13.3px)] text-white">
          <div className="relative flex items-end aspect-[360/399] px-[18px] py-5 rounded-[12px] overflow-hidden">
            <Image
              src="/images/home/tours/bgFourthDesk.webp"
              alt="background"
              width={720}
              height={798}
              className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
            />
            <p className="text-20med lg:text-28med">Різдвяні ярмарки Європи</p>
          </div>
          <div className="relative aspect-[360/165] px-[18px] py-5 rounded-[12px] overflow-hidden">
            <Image
              src="/images/home/tours/bgFifthDesk.webp"
              alt="background"
              width={720}
              height={330}
              className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
            />
            <p className="max-w-[62%] text-20med lg:text-28med">Морські тури</p>
            <div className="absolute -z-10 top-[-232px] left-[-150px] lg:top-[-212px] lg:left-[-110px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
          </div>
        </div>
        <ToursListMob />
      </Container>
    </section>
  );
}
