import { Category } from "./category";

export interface TourBenefitListItem {
  text: string;
  sublist?: string[];
}

export interface TourProgramListItem {
  description?: string;
  sublist: { title: string; description?: string }[];
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  category: Category;
  earlyBooking: boolean;
  images: {
    url: string;
    alt: string;
  }[];
  benefits: {
    image: { url: string; alt: string };
    list: TourBenefitListItem[];
  };
  program: { url: string; list: TourProgramListItem[] };
  points: [];
  includedInCost: [];
  notIncludedInCost: [];
  inspiration: [];
}
