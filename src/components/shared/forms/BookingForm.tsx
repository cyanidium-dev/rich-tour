"use client";
import { Form, Formik, FormikHelpers, FieldArray } from "formik";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";
import MaskedInput from "react-text-mask";
import dynamic from "next/dynamic";
import { Checkbox } from "@heroui/react";
import { bookingValidation } from "@/schemas/bookingFormValidation";
import { dateMask, phoneMask } from "@/regex/regex";
import { handleSubmitForm } from "@/utils/handleSubmitForm";
import { formatTourDeparturesToOptions } from "@/utils/formatTourDeparturesOptions";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";
import IconButton from "../buttons/IconButton";
import TrashIcon from "../icons/TrashIcon";
import { TourDepartures } from "@/types/tour";
import axios from 'axios'

const ClientNumberInput = dynamic(
  () => import("@heroui/react").then((mod) => mod.NumberInput),
  {
    ssr: false,
  }
);

export interface TravelerInfo {
  name: string;
  surname: string;
  phone?: string;
  passport: string;
  birthDate: string;
  passportExpiration: string;
  boardingCity: string;
  insurance: boolean;
  frontSeats: boolean;
  passportInProgress: boolean;
}

export interface ValuesBookingFormType {
  date: string;
  travelersQty: number | null;
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
  tourId: string;
  variant?: "red" | "black";
}

export default function BookingForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  tourDepartures,
  className = "",
  variant = "red",
    tourId,
}: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [focusedTravelerIndex, setFocusedTravelerIndex] = useState<
    number | null
  >(null);

  const initialValues: ValuesBookingFormType = {
    date: "",
    travelersQty: null,
    email: "",
    phone: "",
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

  const selectOptions = formatTourDeparturesToOptions(tourDepartures);

  const submitForm = async (
    values: ValuesBookingFormType,
    formikHelpers: FormikHelpers<ValuesBookingFormType>
  ) => {
    const payload = {
      ...values,
      tourId,
    };
    const response = await axios.post('/api/booking', payload);

    console.log('API RESPONSE:', response.data);
    await handleSubmitForm(
        payload,
        formikHelpers,
        setIsLoading,
        setIsError,
        setIsNotificationShown,
        setIsPopUpShown
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={validationSchema}
    >
      {({ errors, setFieldTouched, touched, dirty, isValid, setFieldValue, values }) => {
        useEffect(() => {
          if (!values.date && selectOptions.length > 0) {
            setFieldValue("date", selectOptions[0].key);
          }
        }, [values.date, selectOptions, setFieldValue]);

        return (
            <Form className={`${className}`}>
              <div className="flex flex-col w-full h-full gap-y-5 mb-[18px]">
                <Select
                    placeholder="Виберіть дату"
                    size="sm"
                    selectedKeys={new Set([values.date])}
                    classNames={{
                      selectorIcon: "right-[18px]",
                      trigger:
                          "bg-white shadow-none border border-black rounded-[6px] h-10 py-[10px] px-4 hover:bg-white focus:bg-white",
                      value: "!text-10reg lg:!text-12reg text-black",
                      popoverContent:
                          "bg-white shadow-none border border-black rounded-[6px]",
                      listbox:
                          "!font-normal !text-[10px] lg:!text-12reg !text-black",
                    }}
                    onSelectionChange={(selected) => {
                      const selectedValue = Array.from(selected)[0];
                      setFieldValue("date", selectedValue);
                    }}
                >
                  {selectOptions.map((option) => (
                      <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
                <ClientNumberInput
                    aria-label="travelers"
                    minValue={1}
                    value={values.travelersQty}
                    onValueChange={(value) => {
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
                    placeholder="Кількість туристів"
                    classNames={{
                      inputWrapper:
                          "bg-white shadow-none border border-black rounded-[6px] h-10 py-[10px] px-4",
                      input: "!text-10reg lg:!text-12reg",
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
                                            as={MaskedInput}
                                            mask={phoneMask}
                                            inputType="tel"
                                            onFocus={() => setFocusedTravelerIndex(index)}
                                            labelClassName="lg:w-[296px]"
                                            fieldFontSize="text-10reg lg:text-12reg"
                                        />
                                        <CustomizedInput
                                            fieldName={`travelers[${index}].passport`}
                                            placeholder="Номер закордонного паспорта"
                                            errors={errors}
                                            touched={touched}
                                            onFocus={() => setFocusedTravelerIndex(index)}
                                            labelClassName="lg:w-[276px]"
                                            fieldFontSize="text-10reg lg:text-12reg"
                                            disabled={values.travelers[index].passportInProgress}
                                        />
                                      </div>
                                      <div className="flex flex-col lg:flex-row gap-y-4 gap-x-3">
                                        <CustomizedInput
                                            fieldName={`travelers[${index}].birthDate`}
                                            placeholder="Дата народження"
                                            as={MaskedInput}
                                            mask={dateMask}
                                            errors={errors}
                                            touched={touched}
                                            onFocus={() => setFocusedTravelerIndex(index)}
                                            labelClassName="lg:w-[145px]"
                                            fieldFontSize="text-10reg lg:text-12reg"
                                        />
                                        <CustomizedInput
                                            fieldName={`travelers[${index}].passportExpiration`}
                                            placeholder="Закінчення дії паспорта"
                                            as={MaskedInput}
                                            mask={dateMask}
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
                                        <Checkbox
                                            radius="sm"
                                            size="sm"
                                            classNames={{
                                              label:
                                                  "text-[12px] leading-[120%] font-normal text-black",
                                              wrapper:
                                                  "before:border before:border-black group-data-[selected=true]:after:bg-main data-[selected=true]:after:border-main",
                                            }}
                                            isSelected={values.travelers[index].insurance}
                                            onValueChange={(value) => {
                                              setFieldValue(
                                                  `travelers[${index}].insurance`,
                                                  value
                                              );
                                            }}
                                        >
                                          Страховка
                                        </Checkbox>
                                        <Checkbox
                                            radius="sm"
                                            size="sm"
                                            classNames={{
                                              label:
                                                  "text-[12px] leading-[120%] font-normal text-black",
                                              wrapper:
                                                  "before:border before:border-black group-data-[selected=true]:after:bg-main data-[selected=true]:after:border-main",
                                            }}
                                            isSelected={
                                              values.travelers[index].frontSeats
                                            }
                                            onValueChange={(value) => {
                                              setFieldValue(
                                                  `travelers[${index}].frontSeats`,
                                                  value
                                              );
                                            }}
                                        >
                                          Передні місця
                                        </Checkbox>
                                        <Checkbox
                                            radius="sm"
                                            size="sm"
                                            classNames={{
                                              label:
                                                  "text-[12px] leading-[120%] font-semibold text-black",
                                              wrapper:
                                                  "before:border before:border-black group-data-[selected=true]:after:bg-main data-[selected=true]:after:border-main",
                                            }}
                                            isSelected={
                                              values.travelers[index].passportInProgress
                                            }
                                            onValueChange={(value) => {
                                              setFieldValue(`travelers[${index}].passportInProgress`, value);

                                              if (value) {
                                                setFieldValue(`travelers[${index}].passport`, "");
                                                setFieldValue(`travelers[${index}].passportExpiration`, "");
                                              }
                                            }}
                                        >
                                          Паспорт виготовляється
                                        </Checkbox>
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
                    as={MaskedInput}
                    mask={phoneMask}
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
