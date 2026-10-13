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

export interface TourDepartureDay {
  day: number;
  price?: number;
  status: string[];
  crmNumber: string;
  departureId: string;
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

export interface TourHotel {
  title: string;
  stars?: number;
  price: number;
  shortDescription: PortableTextBlock[];
  fullDescription: PortableTextBlock[];
  gallery: string[];
  galleryVariants?: { feature: string; thumb: string; card: string; modal: string }[];
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
  images: { url: string; mobileUrl?: string; alt: string }[];
  benefits: {
    image?: { url: string; alt: string };
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
