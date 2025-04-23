"use client";
import { Form, Formik, FormikHelpers, FieldArray } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import MaskedInput from "react-text-mask";
import dynamic from "next/dynamic";
import { bookingValidation } from "@/schemas/bookingFormValidation";
import { dateMask, phoneMask } from "@/regex/regex";
import { handleSubmitForm } from "@/utils/handleSubmitForm";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";
import IconButton from "../buttons/IconButton";
import TrashIcon from "../icons/TrashIcon";

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
}

export interface ValuesBookingFormType {
  travelersQty: number;
  email: string;
  phone: string;
  message: string;
  travelers: TravelerInfo[];
}

interface BookingFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

export default function BookingForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  className = "",
  variant = "red",
}: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [focusedTravelerIndex, setFocusedTravelerIndex] = useState<
    number | null
  >(null);

  const initialValues: ValuesBookingFormType = {
    travelersQty: 1,
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
      },
    ],
  };

  const validationSchema = bookingValidation();

  const submitForm = async (
    values: ValuesBookingFormType,
    formikHelpers: FormikHelpers<ValuesBookingFormType>
  ) => {
    await handleSubmitForm<ValuesBookingFormType>(
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
      {({ errors, touched, dirty, isValid, setFieldValue, values }) => {
        return (
          <Form className={`${className}`}>
            <div className="flex flex-col w-full h-full gap-y-5 mb-[18px]">
              <ClientNumberInput
                aria-label="travelers"
                minValue={1}
                value={values.travelersQty}
                onChange={(value) => {
                  setFieldValue("travelersQty", value);
                  if (Number(value) > values.travelers.length) {
                    const newTravelers = [...values.travelers];
                    for (
                      let i = values.travelers.length;
                      i < Number(value);
                      i++
                    ) {
                      newTravelers.push({
                        name: "",
                        surname: "",
                        phone: "",
                        passport: "",
                        birthDate: "",
                        passportExpiration: "",
                        boardingCity: "",
                      });
                    }
                    setFieldValue("travelers", newTravelers);
                  } else if (Number(value) < values.travelers.length) {
                    const newTravelers = values.travelers.slice(
                      0,
                      Number(value)
                    );
                    setFieldValue("travelers", newTravelers);
                  }
                }}
                placeholder="Кількість туристів"
                classNames={{
                  inputWrapper:
                    "bg-white shadow-none border border-black rounded-[6px] h-10 py-[10px] px-4",
                  innerWrapper: "p-0",
                  input: "!text-12reg placeholder:text-black",
                }}
              />
              <FieldArray name="travelers">
                {({ remove }) => (
                  <div className="flex flex-col gap-y-4">
                    {values.travelers.map((_, index) => (
                      <div key={index} className="flex gap-x-[6px]">
                        <div className="flex flex-col gap-y-[18px] w-[calc(100%-6px-24px)]">
                          <div className="flex gap-x-3">
                            <p className="flex items-center justify-center size-10 border border-black rounded-[6px]">
                              {index + 1}
                            </p>
                            <CustomizedInput
                              fieldName={`travelers[${index}].surname`}
                              placeholder="Прізвище латиницею"
                              errors={errors}
                              touched={touched}
                              labelClassName="w-[calc(100%-40px-12px-0.5px)]"
                              onFocus={() => setFocusedTravelerIndex(index)}
                            />
                          </div>
                          <CustomizedInput
                            fieldName={`travelers[${index}].name`}
                            placeholder="Ім’я латиницею"
                            errors={errors}
                            touched={touched}
                            onFocus={() => setFocusedTravelerIndex(index)}
                          />
                          {focusedTravelerIndex === index && (
                            <>
                              <CustomizedInput
                                fieldName={`travelers[${index}].phone`}
                                placeholder="Номер телефону"
                                errors={errors}
                                touched={touched}
                                as={MaskedInput}
                                mask={phoneMask}
                                inputType="tel"
                                onFocus={() => setFocusedTravelerIndex(index)}
                              />
                              <CustomizedInput
                                fieldName={`travelers[${index}].passport`}
                                placeholder="Номер закордонного паспорта"
                                errors={errors}
                                touched={touched}
                                onFocus={() => setFocusedTravelerIndex(index)}
                              />
                              <CustomizedInput
                                fieldName={`travelers[${index}].birthDate`}
                                placeholder="Дата народження"
                                as={MaskedInput}
                                mask={dateMask}
                                errors={errors}
                                touched={touched}
                                onFocus={() => setFocusedTravelerIndex(index)}
                              />
                              <CustomizedInput
                                fieldName={`travelers[${index}].passportExpiration`}
                                placeholder="Закінчення дії паспорта"
                                as={MaskedInput}
                                mask={dateMask}
                                errors={errors}
                                touched={touched}
                                onFocus={() => setFocusedTravelerIndex(index)}
                              />
                              <CustomizedInput
                                fieldName={`travelers[${index}].boardingCity`}
                                placeholder="Місто посадки"
                                errors={errors}
                                touched={touched}
                                onFocus={() => setFocusedTravelerIndex(index)}
                              />
                            </>
                          )}
                        </div>
                        <IconButton
                          handleClick={() => {
                            if (values.travelers.length > 1) {
                              remove(index);
                              setFieldValue(
                                "travelersQty",
                                values.travelersQty - 1
                              );
                            }
                          }}
                          className="h-[38px]"
                        >
                          <TrashIcon className="size-6" />
                        </IconButton>
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
              />
              <CustomizedInput
                fieldName="phone"
                inputType="tel"
                placeholder="Номер телефону"
                errors={errors}
                touched={touched}
                as={MaskedInput}
                mask={phoneMask}
              />
              <CustomizedInput
                fieldName="message"
                as="textarea"
                placeholder="Додаткове повідомлення"
                errors={errors}
                touched={touched}
              />
            </div>
            <SubmitButton
              dirty={dirty}
              isValid={isValid}
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
