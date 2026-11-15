"use client";
import type { Dispatch, SetStateAction } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingDateSelect, BookingTravelerCount } from "./BookingFields";
import CustomizedInput from "./BookingInput";
import PassengerSection from "./PassengerSection";
import { SubmitButton } from "@/shared/ui";
import { getBookingDepartureOptions, type TourDepartures } from "@/entities/tour";
import { bookingSchema, emptyTraveler, type BookingValues } from "../model/schemas";
import { useTravelers } from "../model/useTravelers";
import { useBookingSubmission } from "../api/useBookingSubmission";
export type { TravelerInfo } from "../model/schemas";
export type ValuesBookingFormType = BookingValues;
interface BookingFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  tourDepartures: TourDepartures;
  className?: string;
  // tourId: string;
  variant?: "red" | "black";
  setErrorText: Dispatch<SetStateAction<string | null>>;
  initialDate?: string | null;
  initialDepartureId?: string;
  companyName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
}
export default function BookingForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  tourDepartures,
  setErrorText,
  className = "",
  variant = "red",
  initialDate,
  initialDepartureId,
  companyName = "",
  email = "",
  phone = "",
  // tourId,
}: BookingFormProps) {
  const selectOptions = getBookingDepartureOptions(tourDepartures);
  const initialDeparture =
    selectOptions.find((option) =>
      initialDate
        ? option.label === initialDate && option.key === initialDepartureId
        : option.key === initialDepartureId,
    ) ?? selectOptions.find((option) => option.label === initialDate);
  const methods = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      date: initialDeparture?.key ?? selectOptions[0]?.key ?? "",
      travelersQty: null,
      companyName: companyName,
      agency: "",
      manager: "",
      email: email,
      phone: phone,
      message: "",
      travelers: [emptyTraveler()],
    },
  });
  const { fields, remove, values, resizeTravelers } = useTravelers(methods);
  const setFieldValue = (name: "date" | "travelersQty", value: string | number | null) =>
    methods.setValue(name, value as never, { shouldDirty: true, shouldValidate: true });
  const { submitForm, isLoading } = useBookingSubmission({
    reset: () => methods.reset(),
    setIsError,
    setIsNotificationShown,
    setIsPopUpShown,
    setErrorText,
    resolveDeparture: (departureId) => selectOptions.find((option) => option.key === departureId),
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitForm)} className={`${className}`}>
        <div className="flex flex-col w-full h-full gap-y-5 mb-[18px]">
          <BookingDateSelect
            options={selectOptions}
            value={values.date}
            onChange={(value) => setFieldValue("date", value)}
          />
          {methods.formState.errors.date && (
            <p role="alert" className="text-9reg text-red ml-2 mt-1">
              {methods.formState.errors.date.message}
            </p>
          )}
          <BookingTravelerCount
            value={values.travelersQty ?? undefined}
            onChange={resizeTravelers}
          />
          {(methods.formState.touchedFields.travelersQty || methods.formState.isSubmitted) &&
            methods.formState.errors.travelersQty && (
              <p className="text-9reg text-red ml-2 mt-1">
                {methods.formState.errors.travelersQty?.message}
              </p>
            )}
          <PassengerSection fields={fields} remove={remove} agent={false} />

          <p className="text-10reg xl:text-12reg text-main">
            <span className="text-10semi xl:text-12semi">Передні місця</span> у автобусі (місця з 5
            по 20) сплачується додатково 10€
          </p>

          {companyName && (
            <CustomizedInput
              fieldName="companyName"
              inputType="text"
              placeholder="Назва агенції"
              fieldFontSize="text-10reg lg:text-12reg"
            />
          )}

          <CustomizedInput
            fieldName="email"
            inputType="email"
            placeholder="Email, на який буде приходити інформація"
            fieldFontSize="text-10reg lg:text-12reg"
          />
          <CustomizedInput
            fieldName="phone"
            inputType="tel"
            placeholder="Номер телефону"
            mask="phone"
            fieldFontSize="text-10reg lg:text-12reg"
          />
          <CustomizedInput
            fieldName="message"
            as="textarea"
            placeholder="Додаткове повідомлення"
            fieldFontSize="text-10reg lg:text-12reg"
          />
        </div>

        <SubmitButton isLoading={isLoading} text="Забронювати" variant={variant} />
      </form>
    </FormProvider>
  );
}
