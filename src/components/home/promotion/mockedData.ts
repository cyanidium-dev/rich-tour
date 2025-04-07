import { Tour } from "@/types/tour";
const tourTemplate = {
  id: "1",
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

export const toursList = createTours(tourTemplate, 20);
