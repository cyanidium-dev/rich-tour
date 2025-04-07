export interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  mainImage: {
    url: string;
    alt: string;
  };
}
