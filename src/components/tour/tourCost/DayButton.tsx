"use client";

import Image from "next/image";
import { DayButtonProps } from "react-day-picker";
import { tourDepartures } from "./mockedData";

function getDayData(date: Date) {
  const year = date.getFullYear();
  const month = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  const day = date.getDate();

  const monthData = tourDepartures[month];
  if (!monthData) return null;

  return monthData.find((item) => item.day === day);
}

export default function DayButton(props: DayButtonProps) {
  const { day, modifiers, ...buttonProps } = props;
  const date = day.date;
  const dayData = getDayData(date);
  const status = dayData?.status || [];

  const iconStatuses = ["guaranteed", "hot", "discount"];
  const borderStatuses = {
    available: "#73A91C",
    fewSeats: "#FFB429",
    onRequest: "#4C6FFF",
    noSeats: "#E43A3A",
    noDeparture: "#18181B",
  };

  const showIcons = status.filter((s) => iconStatuses.includes(s));
  const borderStatus = status.find((s) => !iconStatuses.includes(s));

  const borderColor = borderStatus
    ? borderStatuses[borderStatus as keyof typeof borderStatuses]
    : "transparent";
  const textColor = borderStatus
    ? borderStatuses[borderStatus as keyof typeof borderStatuses]
    : "black";

  const statusIcons: Record<string, string> = {
    guaranteed: "/images/icons/calendar/guaranteed.svg",
    hot: "/images/icons/calendar/hot.svg",
    discount: "/images/icons/calendar/discount.svg",
  };

  const hasPrice = !!dayData?.price;
  const isSelected = modifiers.selected;
  const isDisabled =
    status.includes("noSeats") || status.includes("noDeparture");

  return (
    <button
      {...buttonProps}
      className={`w-[44px] h-[49px] rounded-[6px] border-2 relative px-[2px] ${
        hasPrice
          ? "flex flex-col items-center justify-start pt-[2px]"
          : "flex items-center justify-center"
      } ${isDisabled ? "opacity-50" : ""}`}
      style={{
        borderColor,
        color: textColor,
      }}
      disabled={isDisabled}
    >
      <span
        className={`${hasPrice ? "text-12med" : "text-16reg"} ${
          isSelected ? "font-bold" : ""
        }`}
      >
        {date.getDate()}
      </span>

      {hasPrice && (
        <span className="text-10semi text-black mt-[1px]">
          {dayData.price}$
        </span>
      )}

      {showIcons.length > 0 && (
        <div className="absolute bottom-[2px] left-1 flex gap-[6px]">
          {showIcons.map((s) => {
            const icon = statusIcons[s];
            if (!icon) return null;
            return <Image key={s} src={icon} alt={s} width={13} height={13} />;
          })}
        </div>
      )}
    </button>
  );
}
