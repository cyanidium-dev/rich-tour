"use client";
import { Form, Formik, FormikHelpers, FieldArray } from "formik";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { BookingCheckbox, BookingDateSelect, BookingTravelerCount } from "./formComponents/BookingFields";
import { bookingValidation } from "@/schemas/bookingFormValidation";
import { handleSubmitForm } from "@/utils/handleSubmitForm";
import { formatTourDeparturesToOptions } from "@/utils/formatTourDeparturesOptions";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";
import IconButton from "../buttons/IconButton";
import TrashIcon from "../icons/TrashIcon";
import { TourDepartures } from "@/types/tour";
import axios from 'axios'
import {TravelerInfo} from "@/contracts/booking";

export type {TravelerInfo} from "@/contracts/booking";

export interface ValuesBookingFormType {
  date: string;
  travelersQty: number | null;
  companyName: string;
  email: string;
  phone: string;
  message: string;
  travelers: TravelerInfo[];
}

type BookingPayload = ValuesBookingFormType & {
  tourId: string;
};

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
  selectedCrmNumber: string;
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
    selectedCrmNumber,
    companyName = "",
    email = "",
    phone = "",
    // tourId,
}: BookingFormProps) {
  const requestIdRef = useRef(crypto.randomUUID());
  const [isLoading, setIsLoading] = useState(false);
  const [focusedTravelerIndex, setFocusedTravelerIndex] = useState<
    number | null
  >(null);

  const selectOptions = formatTourDeparturesToOptions(tourDepartures);
  const defaultDate = initialDate && selectOptions.some((option) => option.key === initialDate)
    ? initialDate
    : selectOptions[0]?.key ?? "";
  const initialValues: ValuesBookingFormType = {
    date: defaultDate,
    travelersQty: null,
    companyName,
    email: email,
    phone: phone,
    message: "",
    travelers: [
      {
        name: "",
        surname: "",
        phone: "",
        passport: "",
        birthDate: "",
        passportExpiration: "",
        boardingCity: "",
        insurance: false,
        frontSeats: false,
        passportInProgress: false,
      },
    ],
  };

  const validationSchema = bookingValidation();

  const submitForm = async (
      values: ValuesBookingFormType,
      formikHelpers: FormikHelpers<ValuesBookingFormType>
  ) => {
    const payload = {
      ...values,
      requestId: requestIdRef.current,
      tourId: selectedCrmNumber,
    };

    try {
      // (по желанию) можно включить лоадер ДО запроса
      setIsLoading(true);
      setIsError(false);
      setErrorText(null);

      await axios.post("/api/booking", payload);

      // успех
      await handleSubmitForm(
          payload,
          formikHelpers,
          setIsLoading,
          setIsError,
          setIsNotificationShown,
          setIsPopUpShown
      );
      requestIdRef.current = crypto.randomUUID();
    } catch (error) {
      // важно: на ошибке тоже показать NotificationPopUp
      setIsError(true);
      const errorCode = axios.isAxiosError(error) && typeof error.response?.data?.error === "string"
        ? error.response.data.error
        : "BOOKING_FAILED";
      setErrorText(errorCode);
      setIsNotificationShown(true);

      // если хочешь закрывать форму при ошибке — оставь, если нет — убери
      setIsPopUpShown(false);
    } finally {
      setIsLoading(false);
    }
  };
  // const submitForm = async (
  //   values: ValuesBookingFormType,
  //   formikHelpers: FormikHelpers<ValuesBookingFormType>
  // ) => {
  //   const payload = {
  //     ...values,
  //     tourId,
  //   };
  //   const response = await axios.post('/api/booking', payload);
  //
  //   await handleSubmitForm(
  //       payload,
  //       formikHelpers,
  //       setIsLoading,
  //       setIsError,
  //       setIsNotificationShown,
  //       setIsPopUpShown
  //   );
  // };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={validationSchema}
    >
      {({ errors, setFieldTouched, touched, dirty, isValid, setFieldValue, values }) => {
        return (
            <Form className={`${className}`}>
              <div className="flex flex-col w-full h-full gap-y-5 mb-[18px]">
                <BookingDateSelect options={selectOptions} value={values.date} onChange={(value) => setFieldValue("date", value)} />
                <BookingTravelerCount
                    value={values.travelersQty ?? undefined}
                    onChange={(value) => {
                      setFieldTouched("travelersQty", true);
                      if (typeof value !== "number" || Number.isNaN(value)) {
                        setFieldValue("travelersQty", null);
                        return;
                      }
                      setFieldValue("travelersQty", value);

                      if (!value) return;

                      if (value > values.travelers.length) {
                        const newTravelers = [...values.travelers];
                        for (let i = values.travelers.length; i < value; i++) {
                          newTravelers.push({
                            name: "",
                            surname: "",
                            phone: "",
                            passport: "",
                            birthDate: "",
                            passportExpiration: "",
                            boardingCity: "",
                            insurance: false,
                            frontSeats: false,
                            passportInProgress: false,
                          });
                        }
                        setFieldValue("travelers", newTravelers);
                      } else if (value < values.travelers.length) {
                        setFieldValue("travelers", values.travelers.slice(0, value));
                      }
                    }}
                />
                {touched.travelersQty && errors.travelersQty && (
                    <p className="text-9reg text-red ml-2 mt-1">
                      {errors.travelersQty}
                    </p>
                )}
                <FieldArray name="travelers">
                  {({remove}) => (
                      <div className="flex flex-col gap-y-4">
                        {values.travelers.map((_, index) => (
                            <div
                                key={index}
                                className={`flex gap-x-[6px] lg:gap-x-3 ${
                                    index === focusedTravelerIndex
                                        ? "lg:p-5 lg:border lg:border-black lg:rounded-[6px]"
                                        : ""
                                }`}
                            >
                              <div className="flex flex-col gap-y-4 w-[calc(100%-6px-24px)] lg:w-full">
                                <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-3">
                                  <div className="flex gap-x-3 ">
                                    <p
                                        className={`flex items-center justify-center w-10 lg:w-[43px] h-10 text-16med border border-black rounded-[6px] ${
                                            index === focusedTravelerIndex
                                                ? "lg:hidden"
                                                : ""
                                        }`}
                                    >
                                      {index + 1}
                                    </p>
                                    <CustomizedInput
                                        fieldName={`travelers[${index}].surname`}
                                        placeholder="Прізвище латиницею"
                                        errors={errors}
                                        touched={touched}
                                        labelClassName="w-[calc(100%-40px-12px-2px)] lg:w-[296px]"
                                        onFocus={() => setFocusedTravelerIndex(index)}
                                        fieldFontSize="text-10reg lg:text-12reg"
                                    />
                                  </div>
                                  <CustomizedInput
                                      fieldName={`travelers[${index}].name`}
                                      placeholder="Ім’я латиницею"
                                      errors={errors}
                                      touched={touched}
                                      onFocus={() => setFocusedTravelerIndex(index)}
                                      labelClassName={` ${
                                          index === focusedTravelerIndex
                                              ? "lg:w-[276px]"
                                              : "lg:w-[269px]"
                                      }`}
                                      fieldFontSize="text-10reg lg:text-12reg"
                                  />
                                </div>
                                {focusedTravelerIndex === index && (
                                    <>
                                      <div className="flex flex-col lg:flex-row gap-y-4 gap-x-3">
                                        <CustomizedInput
                                            fieldName={`travelers[${index}].phone`}
                                            placeholder="Номер телефону"
                                            errors={errors}
                                            touched={touched}
                                            mask="phone"
                                            inputType="tel"
                                            onFocus={() => setFocusedTravelerIndex(index)}
                                            labelClassName="lg:w-[296px]"
                                            fieldFontSize="text-10reg lg:text-12reg"
                                        />
                                        <CustomizedInput
                                            fieldName={`travelers[${index}].passport`}
                                            placeholder="AA123456"
                                            errors={errors}
                                            touched={touched}
                                            mask="passport"
                                            onFocus={() => setFocusedTravelerIndex(index)}
                                            labelClassName="lg:w-[276px]"
                                            fieldFontSize="text-10reg lg:text-12reg"
                                            disabled={values.travelers[index].passportInProgress}
                                            onChange={(e) => {
                                              const cleaned = e.target.value
                                                  .replace(/[^a-zA-Z0-9]/g, "")
                                                  .toUpperCase();

                                              setFieldValue(`travelers[${index}].passport`, cleaned);
                                            }}
                                        />
                                      </div>
                                      <div className="flex flex-col lg:flex-row gap-y-4 gap-x-3">
                                        <CustomizedInput
                                            fieldName={`travelers[${index}].birthDate`}
                                            placeholder="Дата народження"
                                            mask="date"
                                            errors={errors}
                                            touched={touched}
                                            onFocus={() => setFocusedTravelerIndex(index)}
                                            labelClassName="lg:w-[145px]"
                                            fieldFontSize="text-10reg lg:text-12reg"
                                        />
                                        <CustomizedInput
                                            fieldName={`travelers[${index}].passportExpiration`}
                                            placeholder="Закінчення дії паспорта"
                                            mask="date"
                                            errors={errors}
                                            touched={touched}
                                            onFocus={() => setFocusedTravelerIndex(index)}
                                            labelClassName="lg:w-[208px]"
                                            fieldFontSize="text-10reg lg:text-12reg"
                                            disabled={values.travelers[index].passportInProgress}
                                        />
                                        <CustomizedInput
                                            fieldName={`travelers[${index}].boardingCity`}
                                            placeholder="Місто посадки"
                                            errors={errors}
                                            touched={touched}
                                            onFocus={() => setFocusedTravelerIndex(index)}
                                            labelClassName="lg:w-[207px]"
                                            fieldFontSize="text-10reg lg:text-12reg"
                                        />
                                      </div>
                                      <div className="flex flex-col lg:flex-row gap-y-4 gap-x-6">
                                        <BookingCheckbox
                                            isSelected={values.travelers[index].insurance}
                                            onChange={(value) => {
                                              setFieldValue(
                                                  `travelers[${index}].insurance`,
                                                  value
                                              );
                                            }}
                                        >
                                          Страховка
                                        </BookingCheckbox>
                                        <BookingCheckbox
                                            isSelected={
                                              values.travelers[index].frontSeats
                                            }
                                            onChange={(value) => {
                                              setFieldValue(
                                                  `travelers[${index}].frontSeats`,
                                                  value
                                              );
                                            }}
                                        >
                                          Передні місця
                                        </BookingCheckbox>
                                        <BookingCheckbox
                                            emphasized
                                            isSelected={
                                              values.travelers[index].passportInProgress
                                            }
                                            onChange={(value) => {
                                              setFieldValue(`travelers[${index}].passportInProgress`, value);

                                              if (value) {
                                                setFieldValue(`travelers[${index}].passport`, "");
                                                setFieldValue(`travelers[${index}].passportExpiration`, "");
                                              }
                                            }}
                                        >
                                          Паспорт виготовляється
                                        </BookingCheckbox>
                                      </div>
                                    </>
                                )}
                              </div>
                              {values.travelers.length > 1 && (
                                  <IconButton
                                      handleClick={() => {
                                        remove(index);
                                        setFieldValue(
                                            "travelersQty",
                                            typeof values.travelersQty === "number"
                                                ? values.travelersQty - 1
                                                : null
                                        );
                                      }}
                                      className="h-[38px]"
                                  >
                                    <TrashIcon className="size-6" />
                                  </IconButton>
                              )}
                            </div>
                        ))}
                      </div>
                  )}
                </FieldArray>

                <p className="text-10reg xl:text-12reg text-main">
                <span className="text-10semi xl:text-12semi">
                  Передні місця
                </span>{" "}
                  у автобусі (місця з 5 по 20) сплачується додатково 10€
                </p>

                {companyName && <CustomizedInput
                    fieldName="companyName"
                    inputType="text"
                    placeholder="Назва агенції"
                    errors={errors}
                    touched={touched}
                    fieldFontSize="text-10reg lg:text-12reg"
                />}

                <CustomizedInput
                    fieldName="email"
                    inputType="email"
                    placeholder="Email, на який буде приходити інформація"
                    errors={errors}
                    touched={touched}
                    fieldFontSize="text-10reg lg:text-12reg"
                />
                <CustomizedInput
                    fieldName="phone"
                    inputType="tel"
                    placeholder="Номер телефону"
                    errors={errors}
                    touched={touched}
                    mask="phone"
                    fieldFontSize="text-10reg lg:text-12reg"
                />
                <CustomizedInput
                    fieldName="message"
                    as="textarea"
                    placeholder="Додаткове повідомлення"
                    errors={errors}
                    touched={touched}
                    fieldFontSize="text-10reg lg:text-12reg"
                />
              </div>
{/*              <pre className="text-xs text-red-500">*/}
{/*  {JSON.stringify(errors, null, 2)}*/}
{/*</pre>*/}
              <SubmitButton
                  isLoading={isLoading}
                  text="Забронювати"
                  variant={variant}
              />
            </Form>
        );
      }}
    </Formik>
  );
}
