import type { TourHotel } from "@/entities/tour";
import { PortableText } from "@portabletext/react";
import HotelVideo from "./HotelVideo";

export default function HotelContent({ value }: { value: TourHotel["fullDescription"] }) {
  return (
    <PortableText
      value={value}
      components={{
        types: {
          hotelVideoFile: ({ value }) => <HotelVideo value={value} />,
          hotelYoutube: ({ value }) => <HotelVideo value={value} />,
        },
        block: {
          normal: ({ children }) => <p className="mb-4 text-base font-normal">{children}</p>,
        },
        list: {
          bullet: ({ children }) => (
            <ul className="mt-4 space-y-2 list-disc list-inside text-base font-normal">
              {children}
            </ul>
          ),
        },
        listItem: {
          bullet: ({ children }) => <li>{children}</li>,
          number: ({ children }) => <li>{children}</li>,
        },
      }}
    />
  );
}
