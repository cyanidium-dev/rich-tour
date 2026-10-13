"use client";
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";
import { emptyTraveler, type BookingValues } from "./schemas";
export function useTravelers(methods: UseFormReturn<BookingValues>) {
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: "travelers" });
  const values = useWatch({ control: methods.control }) as BookingValues;
  const resizeTravelers = (value: number | undefined) => {
    methods.setValue("travelersQty", value === undefined || Number.isNaN(value) ? null : value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
    if (!value || !Number.isInteger(value) || value < 1) return;
    const travelers = methods.getValues("travelers");
    if (value > travelers.length)
      append(Array.from({ length: value - travelers.length }, emptyTraveler));
    else if (value < travelers.length)
      remove(Array.from({ length: travelers.length - value }, (_, i) => value + i));
  };
  return { fields, remove, values, resizeTravelers };
}
