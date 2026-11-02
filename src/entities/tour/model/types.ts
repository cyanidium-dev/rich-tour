import { Category } from "./category";
import type { TourImageSource } from "./tourImageUrl";

import type { PortableTextBlock } from "@/shared/lib";
export type { PortableTextBlock } from "@/shared/lib";

export interface TourBenefitListItem {
  text: string;
  sublist?: string[];
}

export interface TourProgramListItem {
  title?: string;
  content?: PortableTextBlock[];
  description?: string;
  sublist?: { title: string; description?: string }[];
}

export interface InspirationItem {
  text: string;
  images?: { url: string; mobileUrl?: string; alt: string }[];
}

export interface CalendarHotelPrice {
  title: string;
  stars?: number;
  price: number;
  earlyBookingPrice?: number;
  placementDescription?: string;
}

export interface TourDepartureDay {
  day: number;
  price?: number;
  status: string[];
  crmNumber: string;
  departureId: string;
  earlyBookingPrice?: number;
  earlyBookingUntil?: string;
  hotels?: CalendarHotelPrice[];
}

export interface TourDepartures {
  [key: string]: TourDepartureDay[];
}

export interface TourShortInfo {
  _id: string;
  slug: { current: string };
  title: string;
  description: string;
  duration: number;
  categories?: Array<{ _ref: string }>;
  category?: Category;
  isOnPromo?: boolean;
  earlyBooking?: boolean;
  image: TourImageSource;
}

export interface HotelVideoFileBlock extends PortableTextBlock {
  _type: "hotelVideoFile";
  url: string;
  mimeType: string;
  size: number;
  title?: string;
  posterUrl?: string;
}

export interface HotelYoutubeBlock extends PortableTextBlock {
  _type: "hotelYoutube";
  videoId: string;
  title?: string;
}

export type HotelVideoBlock = HotelVideoFileBlock | HotelYoutubeBlock;
export type HotelDescriptionBlock = PortableTextBlock | HotelVideoBlock;

export interface TourHotel {
  title: string;
  stars?: number;
  price: number;
  shortDescription: HotelDescriptionBlock[];
  fullDescription: HotelDescriptionBlock[];
  gallery: string[];
  galleryVariants?: { feature: string; thumb: string; card: string; modal: string }[];
}

export interface TourPageImage {
  url: string;
  mobileUrl?: string;
  alt: string;
}

export interface Tour {
  id: string;
  selectedDepartureId: string;
  crmNumber: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  category?: Category;
  earlyBooking: boolean;
  agencyCommission?: { type: string; value: number };
  heroImages: {
    main?: TourPageImage;
    left?: TourPageImage;
    right?: TourPageImage;
  };
  costImages: {
    short?: TourPageImage;
    tall?: TourPageImage;
  };
  benefits: {
    image?: TourPageImage;
    list: TourBenefitListItem[];
  };
  program: { url: string; list: TourProgramListItem[] };
  excursions?: { url: string; list: TourProgramListItem[] };
  programUpload?: { url: string };
  hotels?: TourHotel[];
  points: string[];
  includedInCost: string[];
  notIncludedInCost: string[];
  tourDepartures: TourDepartures;
  inspiration: InspirationItem[];
  additionalInfo?: string;
}
