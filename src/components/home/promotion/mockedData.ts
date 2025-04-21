import { Tour } from "@/types/tour";

type Category = {
  title: string;
  value: string;
};

const categories: Category[] = [
  { title: "Акційні тури", value: "promotion" },
  { title: "SMART тури", value: "smart" },
  { title: "Регулярні тури Європою", value: "europe" },
  { title: "Тури під заказні групи", value: "custom" },
  { title: "Львів для дітей", value: "lviv" },
  { title: "Різдвяні ярмарки Європою", value: "christmas" },
];

const getCategoryByIndex = (index: number): Category => {
  return categories[index % categories.length];
};

const getEarlyBookingByIndex = (index: number): boolean => {
  return index % 3 === 0;
};

const tourTemplate: Tour = {
  id: "1",
  slug: "tour-do-shwejcarii",
  title: "Тур до Швейцарії. Вирушайте у подорож до Швейцарії",
  description:
    "Вирушайте у подорож до Швейцарії – країни неймовірних пейзажів, бездоганного сервісу та справжнього затишку!",
  duration: 10,
  images: [
    { url: "/images/mockedPhoto/nightCity.webp", alt: "night city" },
    { url: "/images/mockedPhoto/tourTwo.webp", alt: "night city" },
    { url: "/images/mockedPhoto/tourThree.webp", alt: "night city" },
  ],
  category: categories[0],
  earlyBooking: false,
  benefits: {
    image: { url: "/images/mockedPhoto/benefitImage.webp", alt: "night city" },
    list: [],
  },
  program: { url: "", list: [] },
  points: [],
  includedInCost: [],
  notIncludedInCost: [],
  inspiration: [],
};

const createTours = (template: Tour, count: number): Tour[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...template,
    id: `${i + 1}`,
    title: `${template.title} #${i + 1}`,
    slug: `${template.slug}-${i + 1}`,
    category: getCategoryByIndex(i),
    earlyBooking: getEarlyBookingByIndex(i),
  }));
};

export const toursList = createTours(tourTemplate, 100);
export { categories };
