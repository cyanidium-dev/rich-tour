import {
    InspirationItem,
    PortableTextBlock,
    Tour,
    TourBenefitListItem,
    TourDepartures,
    TourHotel,
    TourProgramListItem,
} from "@/types/tour";

type ImageUrl = { url?: string };
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
    stars?: number;
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
    benefits?: PortableTextBlock[];
    sections?: TourProgramListItem[];
    excursions?: TourProgramListItem[];
    route?: PortableTextBlock[];
    includes?: PortableTextBlock[];
    unincludes?: PortableTextBlock[];
    additionalConditions?: PortableTextBlock[];
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
    image?: { asset?: { url?: string } };
    departures?: RawDeparture[];
    selectedDeparture?: RawSelectedDeparture | null;
};

function blockText(block: PortableTextBlock) {
    return (block.children ?? []).map((child) => child.text ?? "").join("").trim();
}

function blocksToStrings(blocks?: PortableTextBlock[]) {
    return (blocks ?? []).map(blockText).filter(Boolean);
}

function mapBenefits(blocks?: PortableTextBlock[]): TourBenefitListItem[] {
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
    if (!hotel?.title || hotel.stars === undefined || hotel.price === undefined) return undefined;

    return {
        title: hotel.title,
        stars: hotel.stars,
        price: hotel.price,
        shortDescription: hotel.shortDescription ?? [],
        fullDescription: hotel.fullDescription ?? [],
        gallery: (hotel.gallery ?? []).flatMap((image) => image.url ? [image.url] : []),
    };
}

function mapInspiration(items?: RawSelectedDeparture["inspiration"]): InspirationItem[] {
    return (items ?? []).map((item) => ({
        text: item.description || item.title || "",
        images: item.image?.url
            ? [{ url: item.image.url, alt: item.title || "Tour image" }]
            : undefined,
    }));
}

export function mapTourPage(raw: RawTourPage): Tour | null {
    const departure = raw.selectedDeparture;
    if (!departure?.crmNumber) return null;

    const baseImage = raw.image?.asset?.url;
    const gallery = (departure.gallery ?? []).flatMap((image) => image.url ? [image.url] : []);
    const imageUrls = [baseImage, ...gallery].filter((url): url is string => Boolean(url));
    const benefitImage = gallery[3] ?? gallery[0] ?? baseImage;

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
        images: imageUrls.map((url) => ({ url, alt: raw.title })),
        benefits: {
            image: benefitImage ? { url: benefitImage, alt: raw.title } : undefined,
            list: mapBenefits(departure.benefits),
        },
        program: {
            url: departure.programUpload?.url ?? "",
            list: departure.sections ?? [],
        },
        excursions: departure.excursions?.length
            ? { url: "", list: departure.excursions }
            : undefined,
        programUpload: departure.programUpload?.url
            ? { url: departure.programUpload.url }
            : undefined,
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
