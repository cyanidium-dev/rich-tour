"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import MaskedInput from "react-text-mask";

import { phoneMask } from "@/regex/regex";
import { callBackValidation } from "@/schemas/callBackFormValidation";
import { handleSubmitForm } from "@/utils/handleSubmitForm";

import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesBookingFormType {
  email: string;
  phone: string;
  message: string;
}

interface BookingFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
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

  const initialValues = {
    email: "",
    phone: "",
    message: "",
  };

  const validationSchema = callBackValidation();

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
      {({ errors, touched, dirty, isValid }) => (
        <Form className={`${className}`}>
          <div className="flex flex-col w-full h-full gap-y-5 mb-[18px]">
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
      )}
    </Formik>
  );
}
