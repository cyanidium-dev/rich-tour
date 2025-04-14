"use client";
import Link from "next/link";
import { Form, Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { resetPasswordValidation } from "@/schemas/resetPasswordFormValidation";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesResetPasswordFormType {
  password: string;
  repeatPassword: string;
}

interface ResetPasswordFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

export default function ResetPasswordForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  className = "",
  variant = "red",
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    password: "",
    repeatPassword: "",
  };

  const validationSchema = resetPasswordValidation();

  const submitForm = async (
    values: ValuesResetPasswordFormType,
    formikHelpers: FormikHelpers<ValuesResetPasswordFormType>
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
              fieldName="password"
              inputType="password"
              placeholder="Новий пароль"
              errors={errors}
              touched={touched}
            />
            <CustomizedInput
              fieldName="repeatPassword"
              inputType="password"
              placeholder="Підтвердити новий пароль"
              errors={errors}
              touched={touched}
            />
          </div>
          <SubmitButton
            dirty={dirty}
            isValid={isValid}
            isLoading={isLoading}
            text="Встановити пароль"
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
