"use client";
import { useState } from "react";
import { DayPicker, Locale, getDefaultClassNames } from "react-day-picker";
import { uk } from "react-day-picker/locale";
import "react-day-picker/style.css";
import Legend from "./Legend";
import MainButton from "@/components/shared/buttons/MainButton";
import DayButton from "./DayButton";

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
