import Image from "next/image";

export default function ToursListMob() {
  return (
    <ul className="flex md:hidden flex-col gap-5 text-white text-[clamp(28px,7vw,34px)] font-medium leading-[123%]">
      <li className="flex items-end relative aspect-[325/178] px-[5.5%] py-[5.7%] rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgFirstMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <p className="max-w-[46.2%]">Тури Європою</p>
        <div className="absolute -z-10 bottom-[-106.7%] left-[-28.3%] w-[98.5%] aspect-[1/1] bg-main rounded-full"></div>
      </li>
      <li className="flex items-end justify-end relative aspect-[325/178] px-[5.5%] py-[5.7%] rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgSecondMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
        />
        <p className="max-w-[57.2%] text-right">Під заказні групи</p>
      </li>
      <li className="relative aspect-[325/178] px-[5.5%] py-[5.7%] rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgThirdMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
        />
        <p className="max-w-[49.2%]">Львів для дітей</p>
      </li>
      <li className="relative aspect-[325/178] px-[5.5%] py-[5.7%] rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgFourthMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
        />
        <p className="max-w-[164px]">Морські тури</p>
        <div className="absolute -z-10 top-[-102.7%] left-[-37.3%] w-[98.5%] aspect-[1/1] bg-main rounded-full"></div>
      </li>
      <li className="flex items-end relative aspect-[325/178] px-[5.5%] py-[5.7%] rounded-[12px] overflow-hidden">
        <Image
          src="/images/home/tours/bgFifthMob.webp"
          alt="background"
          width={650}
          height={356}
          className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
        />
        <p className="max-w-[90%] sm:max-w-[86%]">Різдвяні ярмарки Європи</p>
      </li>
    </ul>
  );
}
