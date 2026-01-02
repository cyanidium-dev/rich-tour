"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import MaskedInput from "react-text-mask";
import { signUpValidation } from "@/schemas/signUpFormValidation";
import { phoneMask, edrpouMask } from "@/regex/regex";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesSignUpFormType {
  email: string;
  companyName: string;
  phone: string;
  edrpou?: string;
  city: string;
  password: string;
  site?: string;
  legalCompanyName?: string;
  taxForm: string;
}

interface SignUpFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

export default function SignUpForm({
                                     setIsError,
                                     setIsNotificationShown,
                                     setIsPopUpShown,
                                     className = "",
                                     variant = "red",
                                   }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initialValues: ValuesSignUpFormType = {
    email: "",
    companyName: "",
    phone: "",
    edrpou: "",
    city: "",
    password: "",
    site: "",
    legalCompanyName: "",
    taxForm: "",
  };

  const validationSchema = signUpValidation();

  const submitForm = async (
      values: ValuesSignUpFormType,
      { resetForm }: FormikHelpers<ValuesSignUpFormType>
  ) => {
    try {
      setIsError(false);
      setIsNotificationShown(false);
      setIsLoading(true);

      await axios.post("/api/auth/sign-up", values, {
        headers: { "Content-Type": "application/json" },
      });

      resetForm();
      setIsNotificationShown(true);

      // ⏱ небольшой UX-delay и редирект на логин
      setTimeout(() => {
        setIsPopUpShown?.(false);
        router.push("/auth/sign-in");
      }, 1500);
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
            <Form className={className}>
              <div className="flex flex-col md:flex-wrap w-full h-full md:h-[283px] gap-5 xl:gap-x-[45px] mb-[18px]">
                <CustomizedInput fieldName="email" inputType="email" placeholder="Email*" errors={errors} touched={touched} />
                <CustomizedInput fieldName="companyName" placeholder="Повне ім’я назви фірми*" errors={errors} touched={touched} />
                <CustomizedInput fieldName="phone" inputType="tel" as={MaskedInput} mask={phoneMask} placeholder="Телефон*" errors={errors} touched={touched} />
                <CustomizedInput fieldName="edrpou" as={MaskedInput} mask={edrpouMask} placeholder="ЄДРПОУ" errors={errors} touched={touched} />
                <CustomizedInput fieldName="city" placeholder="Місто*" errors={errors} touched={touched} />
                <CustomizedInput fieldName="password" inputType="password" placeholder="Пароль*" errors={errors} touched={touched} />
                <CustomizedInput fieldName="site" placeholder="Сайт" errors={errors} touched={touched} />
                <CustomizedInput fieldName="legalCompanyName" placeholder="Юридична назва фірми" errors={errors} touched={touched} />
                <CustomizedInput fieldName="taxForm" placeholder="Форма оподаткування*" errors={errors} touched={touched} />

                <SubmitButton
                    dirty={dirty}
                    isValid={isValid}
                    isLoading={isLoading}
                    text="Зареєструватися"
                    variant={variant}
                    className="w-full md:w-1/2"
                />
              </div>

              <p className="mt-4 text-12reg text-center">
                Уже маєте аккаунт?{" "}
                <Link href="/auth/sign-in" className="xl:hover:text-main">
                  Вхід
                </Link>
              </p>
            </Form>
        )}
      </Formik>
  );
}
