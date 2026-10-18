import type { SiteContacts } from "@/shared/config";
import Image from "next/image";

export default function Map({ contacts }: { contacts: SiteContacts | null }) {
  if (!contacts?.map) {
    return null;
  }

  return (
    <a href={contacts.map} target="_blank" rel="noopener noreferrer nofollow">
      <div
        className="relative max-w-[246px] md:max-w-full xl:max-w-[264px] aspect-[246/246] xl:aspect-[264/245] mt-8 md:mt-0 mx-auto md:mx-0
     rounded-[12px] overflow-hidden"
      >
        <Image
          src="/images/footer/map-lviv-cities.webp"
          alt="Карта околиць Львова"
          fill
          sizes="90vw"
          className="object-cover"
        />
      </div>
    </a>
  );
}
