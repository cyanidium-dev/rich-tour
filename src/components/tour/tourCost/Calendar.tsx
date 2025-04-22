"use client";
import { useState } from "react";
import Image from "next/image";
import { DayPicker, Locale, getDefaultClassNames } from "react-day-picker";
import { uk } from "react-day-picker/locale";
import { DayButtonProps } from "react-day-picker";
import { tourDepartures } from "./mockedData";
import "react-day-picker/style.css";
import Legend from "./Legend";
import MainButton from "@/components/shared/buttons/MainButton";

export default function Calendar() {
  const [selected, setSelected] = useState<Date>();

  const defaultClassNames = getDefaultClassNames();

  const customUk: Locale = {
    ...uk,
    localize: {
      ...uk.localize,
      month: (n, opts) => {
        const base = uk.localize.month(n, opts);
        return base.charAt(0).toUpperCase() + base.slice(1);
      },
      day: (n, opts) => {
        const base = uk.localize.day(n, opts);
        return base.charAt(0).toUpperCase() + base.slice(1);
      },
    },
  };

  const today = new Date();
  const nextYear = today.getFullYear() + 1;

  const initialMonth = today;
  const maxDate = new Date(nextYear, 11, 31);

  function getDayData(date: Date) {
    const year = date.getFullYear();
    const month = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const day = date.getDate();

    const monthData = tourDepartures[month];
    if (!monthData) return null;

    return monthData.find((item) => item.day === day);
  }

  function DayButton(props: DayButtonProps) {
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
      ? borderStatuses[borderStatus]
      : "transparent";
    const textColor = borderStatus ? borderStatuses[borderStatus] : "black";

    const statusIcons: Record<string, string> = {
      guaranteed: "/images/icons/calendar/guaranteed.svg",
      hot: "/images/icons/calendar/hot.svg",
      discount: "/images/icons/calendar/discount.svg",
    };

    return (
      <button
        {...buttonProps}
        className={`w-[44px] h-[49px] rounded-[6px] relative border-2`}
        style={{
          borderColor: borderColor,
          color: textColor,
        }}
      >
        <span>{date.getDate()}</span>

        {showIcons.map((s, idx) => {
          const icon = statusIcons[s];
          if (!icon) return null;

          return (
            <Image
              key={s}
              src={icon}
              alt={s}
              width={13}
              height={13}
              className={`absolute ${
                idx === 0 ? "bottom-0 left-1" : "bottom-0 left-5"
              }`}
            />
          );
        })}
      </button>
    );
  }

  return (
    <div className="md:w-[calc(33.3%-26.67px)] flex flex-col gap-y-7">
      <div className="rounded-[28px] border border-black">
        <p className="pl-4 pr-3 pt-4 pb-3 text-16semi text-center border-b border-lightGrey">
          Дати виїздів та ціни
        </p>
        <DayPicker
          animate
          mode="single"
          locale={customUk}
          captionLayout="dropdown-years"
          selected={selected}
          onSelect={setSelected}
          fixedWeeks={true}
          showOutsideDays
          startMonth={initialMonth}
          endMonth={maxDate}
          components={{
            DayButton,
          }}
          classNames={{
            month_caption: `px-2 py-[18px] text-14med`,
            caption_label: "hidden",
            dropdown: `bg-white appearance-none bg-[url('/images/icons/calendar/arrow.svg')] bg-no-repeat bg-[right_8px_center] bg-[length:16px_16px] pr-6 outline-none text-16reg cursor-pointer`,
            day: "text-16reg",
            // day_button: `w-[44px] h-[49px] border border-main rounded-[6px]`,
            weekday: "mt-[10px] py-3 text-16reg",
            week: "h-[57.5px]",
            chevron: "size-[18px]",
            today: "text-main",
            nav: `${defaultClassNames.nav} gap-x-2 pt-[10px] pr-1`,
          }}
          className="pl-3 pr-3"
        />
        <Legend />
      </div>
      <MainButton className="w-full h-12 text-14med">Забронювати</MainButton>
    </div>
  );
}
