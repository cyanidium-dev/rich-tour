import { Tour } from "@/types/tour";
const tourTemplate = {
  id: "1",
  slug: "tour-do-shwejcarii",
  title: "Тур до Швейцарії",
  description:
    "Вирушайте у подорож до Швейцарії – країни неймовірних пейзажів, бездоганного сервісу та справжнього затишку!",
  duration: 10,
  mainImage: { url: "/images/mockedPhoto/nightCity.webp", alt: "night city" },
};

const createTours = (template: Tour, count: number): Tour[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...template,
    id: `${i + 1}`,
    title: `${template.title} #${i + 1}`,
  }));
};

export const toursList = createTours(tourTemplate, 23);

export const categories = [
  { title: "Акційні тури", value: "promotion" },
  { title: "SMART тури", value: "smart" },
  { title: "Регулярні тури Європою", value: "europe" },
  { title: "Тури під заказні групи", value: "custom" },
  { title: "Львів для дітей", value: "lviv" },
  { title: "Різдвяні ярмарки Європою", value: "christmas" },
];
