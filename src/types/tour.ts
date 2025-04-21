import { Category } from "./category";

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
  benefits: { image: { url: string; alt: string }; list: [] };
  program: [];
  points: [];
  includedInCost: [];
  notIncludedInCost: [];
  inspiration: [];
}
