import {
  InspirationItem,
  PortableTextBlock,
  Tour,
  TourBenefitListItem,
  TourDepartures,
  TourHotel,
  TourProgramListItem,
} from "./types";
import { tourImageUrl, type TourImageSource } from "./tourImageUrl";

type RawTextBlock = Partial<PortableTextBlock>;

type ImageUrl = TourImageSource;
type RawDeparture = {
  _id: string;
  crmNumber?: string;
  dateRange?: { startDate?: string; endDate?: string };
  price?: number;
  availability?: string;
  guaranteed?: boolean;
  hot?: boolean;
  discount?: boolean;
};
type RawHotel = {
  title?: string;
  stars?: number | null;
  price?: number;
  shortDescription?: PortableTextBlock[];
  fullDescription?: PortableTextBlock[];
  gallery?: ImageUrl[];
};
type RawSelectedDeparture = RawDeparture & {
  title?: string;
  agencyCommission?: { type: string; value: number };
  gallery?: ImageUrl[];
  programUpload?: { url?: string };
  benefits?: RawTextBlock[];
  sections?: TourProgramListItem[];
  excursions?: TourProgramListItem[];
  route?: RawTextBlock[];
  includes?: RawTextBlock[];
  unincludes?: RawTextBlock[];
  additionalConditions?: RawTextBlock[];
  hotels?: RawHotel[];
  inspiration?: Array<{
    title?: string;
    description?: string;
    image?: ImageUrl;
  }>;
};

export type RawTourPage = {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  duration: number;
  earlyBooking?: boolean;
  image?: TourImageSource;
  departures?: RawDeparture[];
  selectedDeparture?: RawSelectedDeparture | null;
};

function blockText(block: RawTextBlock) {
  return (block.children ?? [])
    .map((child) => child.text ?? "")
    .join("")
    .trim();
}

function blocksToStrings(blocks?: RawTextBlock[]) {
  return (blocks ?? []).map(blockText).filter(Boolean);
}

function mapBenefits(blocks?: RawTextBlock[]): TourBenefitListItem[] {
  const result: TourBenefitListItem[] = [];

  for (const block of blocks ?? []) {
    const text = blockText(block);
    if (!text) continue;

    if ((block.level ?? 1) > 1 && result.length > 0) {
      const parent = result[result.length - 1];
      parent.sublist = [...(parent.sublist ?? []), text];
    } else {
      result.push({ text });
    }
  }

  return result;
}

function mapDepartures(departures?: RawDeparture[]): TourDepartures {
  const result: TourDepartures = {};

  for (const departure of departures ?? []) {
    const startDate = departure.dateRange?.startDate;
    if (!startDate || !departure.crmNumber) continue;

    const [year, month, day] = startDate.split("-");
    if (!year || !month || !day) continue;

    const monthKey = `${year}-${month}`;
    const status = [
      departure.availability ?? "available",
      ...(departure.guaranteed ? ["guaranteed"] : []),
      ...(departure.hot ? ["hot"] : []),
      ...(departure.discount ? ["discount"] : []),
    ];
    const item = {
      day: Number(day),
      price: departure.price,
      status,
      crmNumber: departure.crmNumber,
      departureId: departure._id,
    };
    result[monthKey] = [...(result[monthKey] ?? []), item];
  }

  return result;
}

function mapHotel(hotel?: RawHotel): TourHotel | undefined {
  if (!hotel?.title || hotel.price === undefined) return undefined;
  const galleryVariants = (hotel.gallery ?? []).flatMap((image) => {
    const feature = tourImageUrl(image, "feature");
    if (!feature) return [];
    return [
      {
        feature,
        thumb: tourImageUrl(image, "thumb") ?? feature,
        card: tourImageUrl(image, "card") ?? feature,
        modal: tourImageUrl(image, "modal") ?? feature,
      },
    ];
  });

  return {
    title: hotel.title,
    ...(hotel.stars != null ? { stars: hotel.stars } : {}),
    price: hotel.price,
    shortDescription: hotel.shortDescription ?? [],
    fullDescription: hotel.fullDescription ?? [],
    gallery: galleryVariants.map((image) => image.feature),
    galleryVariants,
  };
}

function mapInspiration(items?: RawSelectedDeparture["inspiration"]): InspirationItem[] {
  return (items ?? []).map((item, index) => ({
    text: item.description || item.title || "",
    images: item.image?.url
      ? [
          {
            url:
              tourImageUrl(item.image, index === 2 ? "desktopShort" : "desktopTall") ??
              item.image.url,
            mobileUrl: tourImageUrl(item.image, index === 0 ? "mobileTall" : "mobileShort"),
            alt: item.title || "Tour image",
          },
        ]
      : undefined,
  }));
}

export function mapTourPage(raw: RawTourPage): Tour | null {
  const departure = raw.selectedDeparture;
  if (!departure?.crmNumber) return null;

  const baseImage = tourImageUrl(raw.image, "heroDesktop");
  const gallery = (departure.gallery ?? []).flatMap((image) => (image.url ? [image] : []));
  const imageUrls = [
    ...(baseImage
      ? [
          {
            url: baseImage,
            mobileUrl: tourImageUrl(raw.image, "heroMobile") ?? baseImage,
            alt: raw.title,
          },
        ]
      : []),
    ...gallery.map((image, index) => ({
      url:
        tourImageUrl(
          image,
          index === 0
            ? "heroLeft"
            : index === 1
              ? "heroRight"
              : index === 3
                ? "costShort"
                : index === 4
                  ? "costTall"
                  : "benefits",
        ) ?? image.url!,
      mobileUrl: tourImageUrl(image, "mobile") ?? image.url!,
      alt: raw.title,
    })),
  ];
  const benefitSource = gallery[3] ?? gallery[0] ?? raw.image;
  const benefitImage = tourImageUrl(benefitSource, "benefits");

  return {
    id: departure._id,
    selectedDepartureId: departure._id,
    crmNumber: departure.crmNumber,
    slug: raw.slug.current,
    title: departure.title || raw.title,
    description: raw.description,
    duration: raw.duration,
    earlyBooking: Boolean(raw.earlyBooking),
    agencyCommission: departure.agencyCommission,
    images: imageUrls,
    benefits: {
      image: benefitImage ? { url: benefitImage, alt: raw.title } : undefined,
      list: mapBenefits(departure.benefits),
    },
    program: {
      url: departure.programUpload?.url ?? "",
      list: departure.sections ?? [],
    },
    excursions: departure.excursions?.length ? { url: "", list: departure.excursions } : undefined,
    programUpload: departure.programUpload?.url ? { url: departure.programUpload.url } : undefined,
    hotels: (departure.hotels ?? []).flatMap((hotel) => {
      const mapped = mapHotel(hotel);
      return mapped ? [mapped] : [];
    }),
    points: blocksToStrings(departure.route),
    includedInCost: blocksToStrings(departure.includes),
    notIncludedInCost: blocksToStrings(departure.unincludes),
    tourDepartures: mapDepartures(raw.departures),
    inspiration: mapInspiration(departure.inspiration),
    additionalInfo: blocksToStrings(departure.additionalConditions).join("\n"),
  };
}
