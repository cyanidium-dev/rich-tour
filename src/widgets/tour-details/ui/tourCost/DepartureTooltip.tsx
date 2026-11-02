"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Tooltip, TooltipTrigger } from "react-aria-components";
import { calendarStatuses } from "./calendarStatuses";
import { formatCalendarPrice, type DeparturePricing } from "./calendarPricing";
import styles from "./DepartureTooltip.module.css";

type Details = {
  anchor: HTMLButtonElement;
  pricing: DeparturePricing;
};
type PriceFormatting = {
  currency: "EUR" | "USD";
  convert: (amount: number) => number;
};
type Source = "hover" | "focus";
const DetailsContext = createContext<{
  id: string;
  anchor?: HTMLButtonElement;
  show: (details: Details, source: Source) => void;
  leave: (anchor: HTMLButtonElement, source: Source) => void;
  close: () => void;
} | null>(null);

export const useDepartureTooltip = () => useContext(DetailsContext);

/** One shared overlay keeps day buttons mounted while hover/focus changes. */
export function DepartureTooltipProvider({
  children,
  resetKey,
  currency,
  convert,
}: PriceFormatting & { children: ReactNode; resetKey?: string }) {
  const [details, setDetails] = useState<Details>();
  const id = useId();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const focused = useRef<HTMLButtonElement | null>(null);
  const hovered = useRef<HTMLButtonElement | null>(null);
  const overTooltip = useRef(false);
  const dismissedFocus = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function cancelClose() {
    clearTimeout(closeTimer.current);
  }
  const close = useCallback(() => {
    clearTimeout(closeTimer.current);
    // DayPicker focuses the selected date after its click handler returns.
    dismissedFocus.current = anchorRef.current;
    focused.current = null;
    hovered.current = null;
    overTooltip.current = false;
    setDetails(undefined);
  }, []);
  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setDetails((current) =>
        current &&
        (focused.current === current.anchor ||
          hovered.current === current.anchor ||
          overTooltip.current)
          ? current
          : undefined,
      );
    }, 180);
  }

  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", dismiss);
    return () => {
      document.removeEventListener("keydown", dismiss);
      clearTimeout(closeTimer.current);
    };
  }, [close]);

  useEffect(() => close(), [resetKey, close]);

  // Month navigation must dismiss details even when the same DOM cell is reused.
  const visible =
    details &&
    details.anchor.isConnected &&
    details.anchor.dataset.tooltipMonth === (resetKey ?? "");

  return (
    <DetailsContext.Provider
      value={{
        id,
        anchor: visible ? details.anchor : undefined,
        show: (next, source) => {
          if (source === "focus" && dismissedFocus.current === next.anchor) return;
          dismissedFocus.current = null;
          cancelClose();
          if (source === "focus") focused.current = next.anchor;
          else hovered.current = next.anchor;
          overTooltip.current = false;
          anchorRef.current = next.anchor;
          next.anchor.dataset.tooltipMonth = resetKey ?? "";
          setDetails(next);
        },
        leave: (anchor, source) => {
          if (source === "focus" && dismissedFocus.current === anchor)
            dismissedFocus.current = null;
          const target = source === "focus" ? focused : hovered;
          if (target.current === anchor) target.current = null;
          scheduleClose();
        },
        close,
      }}
    >
      {children}
      <TooltipTrigger
        isOpen={Boolean(visible)}
        onOpenChange={(open) => {
          // RAC also requests closing on page scroll. Keep details while the
          // pointer/focus is still on the date, including scroll anchoring on mount.
          if (!open) scheduleClose();
        }}
      >
        <Tooltip
          triggerRef={anchorRef}
          placement="bottom"
          offset={6}
          containerPadding={12}
          className={styles.tooltip}
          onMouseEnter={() => {
            cancelClose();
            overTooltip.current = true;
          }}
          onMouseLeave={() => {
            overTooltip.current = false;
            scheduleClose();
          }}
        >
          {details && (
            <div id={id}>
              <DepartureDetails pricing={details.pricing} currency={currency} convert={convert} />
            </div>
          )}
        </Tooltip>
      </TooltipTrigger>
    </DetailsContext.Provider>
  );
}

export function DepartureDetails({
  pricing,
  currency,
  convert,
}: Omit<Details, "anchor"> & PriceFormatting) {
  const price = (amount: number) => formatCalendarPrice(amount, currency, convert);
  const until = pricing.earlyBookingUntil?.split("-").reverse().join(".");
  return (
    <>
      <ul className={styles.statuses}>
        {pricing.status
          .filter((status) => calendarStatuses[status])
          .map((status) => (
            <li key={status}>
              <Image src={calendarStatuses[status].image} alt="" width={18} height={18} />
              <span>
                {calendarStatuses[status].label}
                {status === "discount" && until ? ` до ${until} включно` : ""}
              </span>
            </li>
          ))}
      </ul>
      {pricing.options.length > 0 && (
        <div className={styles.options}>
          {pricing.options.map((option, index) => (
            <div key={index} className={styles.option}>
              <p className={styles.title}>
                {option.title}
                {option.stars ? ` ${option.stars}★` : ""}
              </p>
              {option.placementDescription && <p>{option.placementDescription}</p>}
              <p className={styles.prices}>
                {option.discounted && <del>{price(option.regularPrice)}</del>}
                <strong className={option.discounted ? styles.discount : undefined}>
                  {price(option.price)}
                </strong>
              </p>
              <p className={styles.perPerson}>за одну людину</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
