"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DayPicker,
  TZDate,
  type ClassNames,
  type Locale,
  getDefaultClassNames,
} from "react-day-picker";
import { uk } from "react-day-picker/locale";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Legend from "./Legend";
import DayButton from "./DayButton";
import BookingWithButton from "../../../../components/shared/booking/BookingWithButton";
import "react-day-picker/style.css";
import { Tour, TourDepartures } from "@/entities/tour/index";
// import {tourDepartures} from "@/widgets/tour-details/ui/tourCost/mockedData";
import { useCurrency } from "@/context/CurrencyContext";
import { isBookableDay } from "./calendarDates";

interface CalendarProps {
  isLogin: boolean;
  tour: Tour;
  companyName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  preview?: boolean;
}

const getTourDepartures = (
  tourDepartures: TourDepartures,
  convert: (price: number) => number,
): TourDepartures => {
  const result: TourDepartures = {};
  for (const [key, value] of Object.entries(tourDepartures)) {
    result[key] = value.map((item) => ({
      ...item,
      price: item.price === undefined ? undefined : convert(item.price),
    }));
  }
  return result;
};

export default function Calendar({ isLogin, tour, preview = false, ...userData }: CalendarProps) {
  const [selected, setSelected] = useState<Date>();
  const [openBookingFlag, setOpenBookingFlag] = useState(false);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const defaultClassNames = getDefaultClassNames();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { convert, selected: currency } = useCurrency();

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

  const timeZone = "Europe/Kyiv";
  const today = TZDate.tz(timeZone);
  const nextYear = today.getFullYear() + 1;

  const initialMonth = new TZDate(today.getFullYear(), today.getMonth(), 1, timeZone);
  const maxDate = new TZDate(nextYear, 11, 31, timeZone);

  const tourDepartures = getTourDepartures(tour.tourDepartures, convert);

  useEffect(() => {
    if (preview) return;
    const requestedBookingDate = searchParams.get("book");
    if (requestedBookingDate) {
      setBookingDate(requestedBookingDate);
      setOpenBookingFlag(true);
    }
  }, [searchParams, preview]);

  const clearBookingParam = () => {
    setOpenBookingFlag(false);
    if (!searchParams.has("book")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("book");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const calendarClassNamesLoggedIn = {
    month_caption: "px-2 py-[18px] text-14med",
    caption_label: "hidden",
    dropdown:
      "bg-white appearance-none bg-[url('/images/icons/calendar/arrow.svg')] bg-no-repeat bg-[right_8px_center] bg-[length:16px_16px] pr-6 outline-none text-16reg cursor-pointer",

    day: "w-full text-16reg",
    weekday: "mt-[10px] py-3 text-16reg",
    week: isLogin && tour.agencyCommission ? "h-[74px] md:h-[57.5px]" : "h-[57.5px]",
    chevron: "size-[18px]",
    today: "text-main",
    month_grid: "w-full table-fixed",
    nav: `${defaultClassNames.nav} gap-x-2 pt-[10px] pr-1`,
  } satisfies Partial<ClassNames>;

  const calendarClassNamesGuest = {
    ...calendarClassNamesLoggedIn,

    day: "text-14reg",
    week: "h-[49px]",
    weekday: "mt-[6px] py-2 text-14reg",
  } satisfies Partial<ClassNames>;

  return (
    <div className="w-full min-w-0 mx-auto flex flex-col gap-y-7">
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30, delay: 0.4 })}
        className="rounded-[28px] border border-black"
      >
        <p className="pl-4 pr-3 pt-4 pb-3 text-16semi text-center border-b border-lightGrey">
          Дати виїздів та ціни
        </p>
        <DayPicker
          animate
          mode="single"
          locale={customUk}
          timeZone={timeZone}
          today={today}
          captionLayout="dropdown-years"
          selected={selected}
          onSelect={setSelected}
          fixedWeeks={true}
          showOutsideDays
          disabled={(date) => !isBookableDay(date, tourDepartures, today)}
          startMonth={initialMonth}
          endMonth={maxDate}
          components={{
            DayButton: (props) => (
              <DayButton
                {...props}
                isLogin={isLogin}
                agencyCommission={tour.agencyCommission}
                currency={currency}
                convert={convert}
                tourDepartures={tourDepartures}
                readOnly={preview}
                openBooking={(dateStr, departureId) => {
                  if (preview) return;
                  if (departureId !== tour.selectedDepartureId) {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("departure", departureId);
                    params.set("book", dateStr);
                    router.push(`${pathname}?${params.toString()}`, { scroll: false });
                    return;
                  }
                  setBookingDate(dateStr);
                  setOpenBookingFlag(true);
                }}
              />
            ),
          }}
          className={`pl-3 pr-3 ${isLogin ? "rdp-full" : ""}`}
          classNames={{
            ...(isLogin ? calendarClassNamesLoggedIn : calendarClassNamesGuest),
            months: isLogin ? "w-full max-w-none" : defaultClassNames.months,
          }}
        />
        <Legend />
      </AnimatedWrapper>
      {isLogin && tour.agencyCommission && (
        <p className="font-semibold text-center">*Друга вказана ціна це комісія для агента</p>
      )}
      {!preview && (
        <BookingWithButton
          {...userData}
          initialDate={bookingDate}
          buttonStyles="w-full h-12 text-14med"
          tour={tour}
          forceOpen={openBookingFlag}
          onForceOpenHandled={clearBookingParam}
        />
      )}
    </div>
  );
}
