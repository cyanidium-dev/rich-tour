import Image from "next/image";
import { calendarStatuses } from "./calendarStatuses";

export default function Legend() {
  const legendList = [
    "guaranteed",
    "available",
    "hot",
    "fewSeats",
    "discount",
    "noSeats",
    "specialPrice",
    "tourInRecruitment",
  ];

  return (
    <ul className="grid grid-cols-2 pt-[7px] pl-5 pr-4 pb-[18px] gap-x-3 gap-y-[9px]">
      {legendList.map((status) => {
        const { label, image } = calendarStatuses[status];
        return (
          <li key={status} className="flex min-w-0 gap-x-[6px] items-center">
            <Image src={image} alt="" width={20} height={20} className="shrink-0" />
            <p className="text-10reg">{label}</p>
          </li>
        );
      })}
    </ul>
  );
}
