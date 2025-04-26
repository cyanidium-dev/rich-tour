import { Review } from "@/types/review";
import { formatDate } from "@/utils/formatDate";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { name, _createdAt, text } = review;

  const formattedDate = formatDate(_createdAt);

  return (
    <div className="min-h-full px-6 py-[30px] rounded-[12px] bg-white shadow-card">
      <div className="mb-5 flex justify-between items-center text-main">
        <p className="text-16semi">{name}</p>
        <p className="text-16reg">{formattedDate}</p>
      </div>
      <p className="text-[14px] font-light line-clamp-5 lg:leading-[150%]">
        {text}
      </p>
    </div>
  );
}
