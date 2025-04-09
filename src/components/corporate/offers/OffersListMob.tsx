import Image from "next/image";

export default function OffersListMob() {
  return (
    <ul className="flex md:hidden flex-col gap-y-5 text-20med xl:text-24med text-white">
      <li className="relative flex items-end w-full h-[448px] p-[26px] rounded-[12px] overflow-hidden">
        <Image
          src="/images/corporate/offers/imageOneMob.webp"
          alt="background"
          fill
          sizes="100vw"
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <div className="absolute -z-10 bottom-[-162px] left-[-50px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
        <p className="max-w-[194px]">Корпоративні тури та тимбілдинги</p>
      </li>
      <li className="relative flex items-end w-full h-[194px] p-[26px] rounded-[12px] overflow-hidden">
        <Image
          src="/images/corporate/offers/imageTwoMob.webp"
          alt="background"
          fill
          sizes="100vw"
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <p className="max-w-[200px]">Участь у виставках та конференціях</p>
      </li>
      <li className="relative w-full h-[264px] p-[26px] rounded-[12px] overflow-hidden">
        <Image
          src="/images/corporate/offers/imageThreeMob.webp"
          alt="background"
          fill
          sizes="100vw"
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <div className="absolute -z-10 top-[-168px] left-[-76px] w-[320px] aspect-[1/1] bg-main rounded-full"></div>
        <p className="max-w-[158px]">Організація ділових подорожей</p>
      </li>
      <li className="relative flex items-end w-full h-[264px] p-[26px] rounded-[12px] overflow-hidden">
        <Image
          src="/images/corporate/offers/imageFourMob.webp"
          alt="background"
          fill
          sizes="100vw"
          className="absolute top-0 left-0 -z-20 w-full h-full object-cover"
        />
        <p className="max-w-[167px]">Індивідуальний підхід</p>
      </li>
    </ul>
  );
}
