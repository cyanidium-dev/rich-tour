import Image from "next/image";
import type { CSSProperties } from "react";
import { DayButton as DefaultDayButton, type DayButtonProps } from "react-day-picker";
import type { TourDepartures } from "@/entities/tour/index";
import { formatBookingDate, getDayData } from "./calendarDates";
import { formatCommission } from "./formatCommission";
import { calendarStatuses } from "./calendarStatuses";
import { formatCalendarPrice, getDeparturePricing } from "./calendarPricing";
import { useDepartureTooltip } from "./DepartureTooltip";
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
  const tooltip = useDepartureTooltip();
  const pricing = dayData ? getDeparturePricing(dayData) : undefined;

  const status = pricing?.status || [];
  const hasPrice = pricing?.price !== undefined;
  const priceText = hasPrice ? formatCalendarPrice(pricing.price!, currency, convert) : "";
  const hasCommission = isLogin && Boolean(agencyCommission);

  const showIcons = status.filter(
    (s) => calendarStatuses[s] && calendarStatuses[s].borderColor === undefined,
  );
  const borderStatus = status.find((s) => calendarStatuses[s]?.borderColor !== undefined);

  const borderColor =
    !hasPrice || borderStatus === "noDeparture"
      ? "transparent"
      : borderStatus
        ? calendarStatuses[borderStatus].borderColor
        : "transparent";

  const backgroundColor =
    !hasPrice || borderStatus === "noDeparture"
      ? "transparent"
      : borderStatus
        ? (calendarStatuses[borderStatus].backgroundColor ?? "transparent")
        : "transparent";

  const isSelected = modifiers.selected;
  const isDisabled =
    modifiers.disabled ||
    !dayData ||
    status.includes("noSeats") ||
    status.includes("noDeparture") ||
    !hasPrice;

  return (
    <DefaultDayButton
      {...buttonProps}
      day={day}
      modifiers={modifiers}
      aria-label={`${buttonProps["aria-label"] ?? ""}${hasPrice ? `, ${priceText}` : ""}${status.length ? `, ${status.map((item) => calendarStatuses[item]?.label ?? item).join(", ")}` : ""}`}
      aria-describedby={
        tooltip?.anchor?.dataset.departureDay === date.toISOString() ? tooltip.id : undefined
      }
      data-departure-day={date.toISOString()}
      onMouseEnter={(event) => {
        buttonProps.onMouseEnter?.(event);
        if (pricing) tooltip?.show({ anchor: event.currentTarget, pricing }, "hover");
      }}
      onMouseLeave={(event) => {
        buttonProps.onMouseLeave?.(event);
        tooltip?.leave(event.currentTarget, "hover");
      }}
      onFocus={(event) => {
        buttonProps.onFocus?.(event);
        if (pricing) tooltip?.show({ anchor: event.currentTarget, pricing }, "focus");
      }}
      onBlur={(event) => {
        buttonProps.onBlur?.(event);
        tooltip?.leave(event.currentTarget, "focus");
      }}
      onClick={(e) => {
        tooltip?.close();
        if (!readOnly && !isDisabled && dayData) {
          buttonProps.onClick?.(e);
          openBooking?.(formatBookingDate(date), dayData.departureId);
        }
      }}
      className={`${buttonProps.className ?? ""} ${styles.dayButton} ${hasPrice ? styles.withPrice : ""} ${hasCommission ? styles.withCommission : ""}`}
      style={{
        ...buttonProps.style,
        width: isLogin ? "100%" : "44px",
        borderRadius: "6px",
        borderColor,
        backgroundColor,
        color: "black",
      }}
      disabled={buttonProps.disabled || isDisabled}
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
          className={`${styles.price} text-10semi text-black leading-[12px] ${hasCommission ? "xl:text-12semi" : ""}`}
        >
          <span
            className={styles.amount}
            style={{ "--amount-length": priceText.length } as CSSProperties}
          >
            {priceText}
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
        <div className={styles.statusIcons}>
          {showIcons.map((s) => {
            const { image, label } = calendarStatuses[s];
            return (
              <span key={s} title={label}>
                <Image src={image} alt="" width={10} height={10} />
              </span>
            );
          })}
        </div>
      )}
    </DefaultDayButton>
  );
}
