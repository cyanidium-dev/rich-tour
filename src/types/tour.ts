import { Category } from "./category";

export interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  category: Category;
  earlyBooking: boolean;
  mainImage: {
    url: string;
    alt: string;
  };
}
