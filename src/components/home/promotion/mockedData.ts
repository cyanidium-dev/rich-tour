type Tour = {
  title: string;
  description: string;
  duration: number;
  mainImage: {
    url: string;
    alt: string;
  };
};

const tourTemplate = {
  title: "Тур до Швейцарії",
  description:
    "Вирушайте у подорож до Швейцарії – країни неймовірних пейзажів, бездоганного сервісу та справжнього затишку!",
  duration: 10,
  mainImage: { url: "/images/mockedPhoto/nightCity.webp", alt: "night city" },
};

const createTours = (template: Tour, count: number): Tour[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...template,
    title: `${template.title} #${i + 1}`,
  }));
};

export const toursList = createTours(tourTemplate, 20);
