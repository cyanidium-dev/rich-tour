import Image from "next/image";
import { DayButton as DefaultDayButton, type DayButtonProps } from "react-day-picker";
import type { TourDepartures } from "@/entities/tour/index";
import { formatBookingDate, getDayData } from "./calendarDates";
import { formatCommission } from "./formatCommission";
import styles from "./DayButton.module.css";

type BtnProps = DayButtonProps & {
  isLogin: boolean;
  currency: "EUR" | "USD";
  convert: (amount: number) => number;
  tourDepartures: TourDepartures;
  openBooking?: (date: string, departureId: string) => void;
  readOnly?: boolean;
  agencyCommission?: {
    type: string;
    value: number;
  };
};

export default function DayButton(props: BtnProps) {
  const {
    openBooking,
    readOnly,
    agencyCommission,
    day,
    modifiers,
    isLogin,
    currency,
    convert,
    tourDepartures,
    ...buttonProps
  } = props;
  const date = day.date;
  const dayData = getDayData(date, tourDepartures);

  const status = dayData?.status || [];
  const hasPrice = dayData?.price !== undefined;
  const hasCommission = isLogin && Boolean(agencyCommission);

  const iconStatuses = ["guaranteed", "hot", "discount"];
  const borderStatuses = {
    available: "#73A91C",
    fewSeats: "#FFB429",
    onRequest: "#4C6FFF",
    noSeats: "#E43A3A",
    noDeparture: "transparent",
  };

  const showIcons = status.filter((s) => iconStatuses.includes(s));
  const borderStatus = status.find((s) => !iconStatuses.includes(s));

  const borderColor =
    !hasPrice || borderStatus === "noDeparture"
      ? "transparent"
      : borderStatus
        ? borderStatuses[borderStatus as keyof typeof borderStatuses]
        : "transparent";

  const textColor =
    !hasPrice || borderStatus === "noDeparture"
      ? "black"
      : borderStatus
        ? borderStatuses[borderStatus as keyof typeof borderStatuses]
        : "black";

  const statusIcons: Record<string, string> = {
    guaranteed: "/images/icons/calendar/guaranteed.svg",
    hot: "/images/icons/calendar/hot.svg",
    discount: "/images/icons/calendar/discount.svg",
  };
  const statusLabels: Record<string, string> = {
    available: "місця є",
    fewSeats: "мало місць",
    onRequest: "виїзд під запит",
    noSeats: "місць немає",
    noDeparture: "немає виїзду",
    guaranteed: "гарантований виїзд",
    hot: "гарячий тур",
    discount: "діє знижка",
  };

  const isSelected = modifiers.selected;
  const isDisabled =
    modifiers.disabled ||
    modifiers.outside ||
    !dayData ||
    status.includes("noSeats") ||
    status.includes("noDeparture") ||
    !hasPrice;

  return (
    <DefaultDayButton
      {...buttonProps}
      day={day}
      modifiers={modifiers}
      aria-label={`${buttonProps["aria-label"]}${hasPrice ? `, ${dayData.price} ${currency}` : ""}${status.length ? `, ${status.map((item) => statusLabels[item] ?? item).join(", ")}` : ""}`}
      onClick={(e) => {
        if (!readOnly && !isDisabled && dayData) {
          buttonProps.onClick?.(e);
          openBooking?.(formatBookingDate(date), dayData.departureId);
        }
      }}
      className={`${buttonProps.className ?? ""} ${isLogin ? "w-full" : "w-[44px]"} ${hasCommission ? styles.withCommission : "h-[49px]"} rounded-[6px] border-2 relative px-[2px] ${
        hasPrice
          ? "flex flex-col items-center justify-start pt-[2px]"
          : "flex items-center justify-center"
      }`}
      style={{
        ...buttonProps.style,
        width: isLogin ? "100%" : "44px",
        height: hasCommission ? undefined : "49px",
        borderRadius: "6px",
        borderColor,
        color: textColor,
      }}
      disabled={readOnly || buttonProps.disabled || modifiers.outside}
    >
      <span
        className={`${hasPrice ? "text-12med" : "text-16reg"} leading-[14px] ${
          isSelected ? "font-bold" : ""
        }`}
      >
        {date.getDate()}
      </span>

      {hasPrice && (
        <span
          className={`
      text-10semi text-black mt-[1px] leading-[12px]
      ${isLogin && agencyCommission ? "xl:text-12semi" : ""}
    `}
        >
          <span className={hasCommission ? "max-md:block max-md:whitespace-nowrap" : ""}>
            {dayData.price}
            {currency === "EUR" ? "€" : "$"}
          </span>
          {hasCommission && agencyCommission && (
            <span className="max-md:block max-md:whitespace-nowrap">
              {" / "}
              {formatCommission(agencyCommission, currency, convert)}
            </span>
          )}
        </span>
      )}

      {showIcons.length > 0 && (
        <div className="absolute bottom-1 left-1 flex gap-[2px] md:bottom-0">
          {showIcons.map((s) => {
            const icon = statusIcons[s];
            if (!icon) return null;
            return <Image key={s} src={icon} alt="" width={10} height={10} />;
          })}
        </div>
      )}
    </DefaultDayButton>
  );
}
