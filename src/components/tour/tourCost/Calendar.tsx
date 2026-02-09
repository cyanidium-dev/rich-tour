"use client";
import { useState } from "react";
import { DayPicker, Locale, getDefaultClassNames } from "react-day-picker";
import { uk } from "react-day-picker/locale";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
// import Legend from "./Legend";
import DayButton from "./DayButton";
import BookingWithButton from "../../shared/booking/BookingWithButton";
import "react-day-picker/style.css";
import { Tour } from "@/types/tour";
// import {tourDepartures} from "@/components/tour/tourCost/mockedData";
import {useCurrency} from "@/context/CurrencyContext";

interface CalendarProps {
  isLogin: boolean;
  tour: Tour;
}


//@ts-expect-error
const getTourDepatures = (tourDepartures, convert) => {
  const result = {};
  for(const [key, value] of Object.entries(tourDepartures)) {
    //@ts-expect-error
    result[key] = value.map(item => ({...item, price: convert(item.price)}))
  }
  return result;
}

export default function Calendar({ isLogin, tour }: CalendarProps) {
  const [selected, setSelected] = useState<Date>();

  const defaultClassNames = getDefaultClassNames();

  const {convert, selected: currency} = useCurrency();

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

  const tourDepartures = getTourDepatures(tour.tourDepartures, convert);

  const calendarClassNamesLoggedIn = {
    month_caption: "px-2 py-[18px] text-14med",
    caption_label: "hidden",
    dropdown:
        "bg-white appearance-none bg-[url('/images/icons/calendar/arrow.svg')] bg-no-repeat bg-[right_8px_center] bg-[length:16px_16px] pr-6 outline-none text-16reg cursor-pointer",

    table: "w-full table-fixed",      // ← КЛЮЧ
    row: "grid grid-cols-7",           // ← КЛЮЧ

    day: "w-full text-16reg",          // ← важно
    weekday: "mt-[10px] py-3 text-16reg",
    week: "h-[57.5px]",
    chevron: "size-[18px]",
    today: "text-main",
    month_grid: "w-full table-fixed",
    nav: `${defaultClassNames.nav} gap-x-2 pt-[10px] pr-1`,
  };

  const calendarClassNamesGuest = {
    ...calendarClassNamesLoggedIn,

    // 👇 отличия для НЕ залогиненного
    day: "text-14reg",
    week: "h-[49px]",
    weekday: "mt-[6px] py-2 text-14reg",
  };

  return (
      <div className={`${isLogin
          ? "xl:w-[calc(66.3%-26.67px)]"
          : "xl:w-[calc(33.3%-26.67px)]"
      } mx-auto flex flex-col gap-y-7`}>
        <AnimatedWrapper
            animation={fadeInAnimation({y: 30, delay: 0.4})}
            className="rounded-[28px] border border-black"
        >
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
                DayButton: (props) => (
                    // @ts-expect-error
                    <DayButton{...props} isLogin={isLogin} agencyCommission={tour.agencyCommission} currency={currency}
                              tourDepartures={tourDepartures}/>
                ),
              }}
              className={`pl-3 pr-3 ${
                  isLogin ? "rdp-full" : ""
              }`}
              classNames={{
                ...(isLogin ? calendarClassNamesLoggedIn : calendarClassNamesGuest),
                months: isLogin
                    ? "w-full max-w-none"
                    : defaultClassNames.months,
              }}
          />
          {/*<Legend />*/}
        </AnimatedWrapper>
        {(isLogin && tour.agencyCommission) && <p className="font-semibold text-center">*Друга вказана ціна це комісія для агента</p>}
        <BookingWithButton buttonStyles="w-full h-12 text-14med" tour={tour}/>
      </div>
  );
}
