export interface Tour {
  id: string;
  title: string;
  description: string;
  duration: number;
  mainImage: {
    url: string;
    alt: string;
  };
}
