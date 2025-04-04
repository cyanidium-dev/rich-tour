"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import MaskedInput from "react-text-mask";

import { phoneMask } from "@/regex/regex";
import { callBackValidation } from "@/schemas/callBackFormValidation";
import { handleSubmitForm } from "@/utils/handleSubmitForm";

import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesCallBackFormType {
  name: string;
  phone: string;
  message: string;
}

interface CallBackFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export default function CallBackForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  className = "",
}: CallBackFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: "",
    phone: "",
    message: "",
  };

  const validationSchema = callBackValidation();

  const submitForm = async (
    values: ValuesCallBackFormType,
    formikHelpers: FormikHelpers<ValuesCallBackFormType>
  ) => {
    const data =
      `<b>Заявка з сайту Rich Tour</b>\n` +
      `<b>Ім'я:</b> ${values.name.trim()}\n` +
      `<b>Телефон:</b> ${values.phone.replace(/[^\d+]/g, "")}\n` +
      `<b>Повідомлення:</b> ${values.message.trim()}\n`;

    await handleSubmitForm<ValuesCallBackFormType>(
      formikHelpers,
      setIsLoading,
      setIsError,
      setIsNotificationShown,
      data,
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
              fieldName="name"
              placeholder="Ім’я"
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
              placeholder="Повідомлення"
              errors={errors}
              touched={touched}
            />
          </div>
          <SubmitButton
            dirty={dirty}
            isValid={isValid}
            isLoading={isLoading}
            text="Відправити"
          />
        </Form>
      )}
    </Formik>
  );
}
