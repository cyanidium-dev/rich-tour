import { Review } from "@/types/review";

const reviewTemplate = {
  id: "1",
  name: "Анастасія",
  createdAt: "2025-04-03 17:08:27.429+00",
  text: "Дякую SMART турам за незабутній відпочинок у Греції! Усе було організовано на найвищому рівні: від перельоту до готелю. Обов'язково звернуся ще раз!",
};

const createTours = (template: Review, count: number): Review[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...template,
    id: `${i + 1}`,
    name: `${template.name} #${i + 1}`,
  }));
};

export const reviewsList = createTours(reviewTemplate, 23);
