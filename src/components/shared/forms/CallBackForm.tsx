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
  };

  const validationSchema = callBackValidation();

  const submitForm = async (
    values: ValuesCallBackFormType,
    formikHelpers: FormikHelpers<ValuesCallBackFormType>
  ) => {
    const data =
      `<b>Заявка з сайту LIGA FINANCE</b>\n` +
      `Ім'я: ${values.name.trim()}\n` +
      `Телефон: ${values.phone.replace(/[^\d+]/g, "")}\n`;

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
            {" "}
            <CustomizedInput
              fieldName="name"
              placeholder="Ім’я"
              errors={errors}
              touched={touched}
              required={true}
            />
            <CustomizedInput
              fieldName="phone"
              inputType="tel"
              placeholder="Номер телефону"
              errors={errors}
              touched={touched}
              as={MaskedInput}
              mask={phoneMask}
              required={true}
            />
            <CustomizedInput
              fieldName="message"
              as="textarea"
              placeholder="Повідомлення"
              errors={errors}
              touched={touched}
              required={true}
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
