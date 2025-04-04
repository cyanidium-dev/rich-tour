import { ADDRESS_URL } from "@/constants/constants";
import Image from "next/image";

export default function Map() {
  return (
    <div
      className="relative max-w-[246px] md:max-w-full xl:max-w-[264px] aspect-[246/246] xl:aspect-[264/245] mt-8 md:mt-0 mx-auto md:mx-0
     rounded-[12px] overflow-hidden"
    >
      <a href={ADDRESS_URL} target="_blank" rel="noopener noreferrer nofollow">
        <Image
          src="/images/footer/map.webp"
          alt="map"
          fill
          sizes="90vw"
          className="object-cover"
        />
      </a>
    </div>
  );
}
