"use client";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import axios from "axios";
import type { BookingValues } from "../model/schemas";
import type { BookingDepartureOption } from "@/entities/tour";
type Setter<T> = Dispatch<SetStateAction<T>>;
export function useBookingSubmission({
  reset,
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  setErrorText,
  resolveDeparture,
  agent = false,
}: {
  reset: () => void;
  setIsError: Setter<boolean>;
  setIsNotificationShown: Setter<boolean>;
  setIsPopUpShown: Setter<boolean>;
  setErrorText?: Setter<string | null>;
  resolveDeparture?: (departureId: string) => BookingDepartureOption | undefined;
  agent?: boolean;
}) {
  const requestId = useRef<string | null>(null);
  const pending = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const submitForm = async (values: BookingValues) => {
    if (pending.current) return;
    pending.current = true;
    setIsLoading(true);
    setIsError(false);
    setErrorText?.(null);
    try {
      if (!agent) {
        const departure = resolveDeparture?.(values.date);
        if (!departure) throw new Error("BOOKING_DEPARTURE_UNAVAILABLE");
        requestId.current ??= crypto.randomUUID();
        // Only the active form's existing fields belong to the HTTP payload.
        const { agency: _agency, manager: _manager, ...payload } = values;
        await axios.post("/api/booking", {
          ...payload,
          requestId: requestId.current,
          date: departure.label,
          departureId: departure.key,
          tourId: departure.crmNumber,
        });
      }
      reset();
      setIsPopUpShown(false);
      setIsNotificationShown(true);
      if (!agent) requestId.current = crypto.randomUUID();
    } catch (error) {
      setIsError(true);
      setErrorText?.(
        axios.isAxiosError(error) && typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : "BOOKING_FAILED",
      );
      setIsNotificationShown(true);
      setIsPopUpShown(false);
    } finally {
      pending.current = false;
      setIsLoading(false);
    }
  };
  return { submitForm, isLoading };
}
