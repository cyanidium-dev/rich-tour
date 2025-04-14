"use client";
import Link from "next/link";
import { Form, Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { loginValidation } from "@/schemas/loginFormValidation";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesLoginFormType {
  email: string;
  password: string;
}

interface LoginFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

export default function LoginForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  className = "",
  variant = "red",
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = loginValidation();

  const submitForm = async (
    values: ValuesLoginFormType,
    formikHelpers: FormikHelpers<ValuesLoginFormType>
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
      setIsNotificationShown(true);
      return error;
    } finally {
      setIsLoading(false);
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
            <CustomizedInput
              fieldName="password"
              inputType="password"
              placeholder="Ваш пароль"
              errors={errors}
              touched={touched}
            />
          </div>
          <p className="mb-4 text-12reg text-center">
            Забули пароль?&nbsp;
            <Link
              href="/auth/reset-password"
              className="xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            >
              Відновити
            </Link>
          </p>
          <SubmitButton
            dirty={dirty}
            isValid={isValid}
            isLoading={isLoading}
            text="Авторизуватися"
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
