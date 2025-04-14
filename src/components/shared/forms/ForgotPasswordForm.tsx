"use client";
import Link from "next/link";
import { Form, Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { forgotPasswordValidation } from "@/schemas/forgotPasswordFormValidation";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesForgotPasswordFormType {
  email: string;
}

interface ForgotPasswordFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

export default function ForgotPasswordForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  className = "",
  variant = "red",
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
  };

  const validationSchema = forgotPasswordValidation();

  const submitForm = async (
    values: ValuesForgotPasswordFormType,
    formikHelpers: FormikHelpers<ValuesForgotPasswordFormType>
  ) => {
    const { resetForm } = formikHelpers;
    try {
      setIsLoading(true);
      resetForm();
      if (setIsPopUpShown) {
        setIsPopUpShown(false);
      }
    } catch (error) {
      setIsError(true);
      return error;
    } finally {
      setIsLoading(false);
      setIsNotificationShown(true);
    }
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
              placeholder="Вкажіть email"
              errors={errors}
              touched={touched}
            />
          </div>
          <SubmitButton
            dirty={dirty}
            isValid={isValid}
            isLoading={isLoading}
            text="Відновити пароль"
            variant={variant}
          />
          <div className="mt-4 pt-4 border-t border-black">
            <Link
              href="/auth/sign-up"
              className="block text-12reg text-center xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            >
              Створити новий доступ
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}
