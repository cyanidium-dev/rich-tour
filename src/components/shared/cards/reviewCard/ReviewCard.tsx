import { Review } from "@/types/review";
import { formatDate } from "@/utils/formatDate";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { name, createdAt, text } = review;

  const formattedDate = formatDate(createdAt);

  return (
    <div className="max-w-[325px] min-h-full px-6 py-[30px] rounded-[12px] bg-white shadow-card">
      <div className="mb-5 flex justify-between items-center text-main">
        <p className="text-16semi">{name}</p>
        <p className="text-16reg">{formattedDate}</p>
      </div>
      <p className="text-14light line-clamp-5">{text}</p>
    </div>
  );
}
