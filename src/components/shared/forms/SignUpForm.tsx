"use client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { Form, Formik, FormikHelpers } from "formik";
import MaskedInput from "react-text-mask";
import { signUpValidation } from "@/schemas/signUpFormValidation";
import { phoneMask } from "@/regex/regex";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesLoginFormType {
  email: string;
  companyName: string;
  phone: string;
  license: string;
  city: string;
  password: string;
  site: string;
  legalCompanyName: string;
  country: string;
}

interface LoginFormProps {
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
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const initialValues = {
    email: "",
    companyName: "",
    phone: "",
    license: "",
    city: "",
    password: "",
    site: "",
    legalCompanyName: "",
    country: "",
  };

  const validationSchema = signUpValidation();

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
      router.push("/dashboard");
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
          <div className="flex flex-col md:flex-wrap w-full h-full md:h-[283px] gap-5 xl:gap-x-[45px] mb-[18px]">
            <CustomizedInput
              fieldName="email"
              inputType="email"
              placeholder="Email*"
              errors={errors}
              touched={touched}
              labelClassName="md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
            <CustomizedInput
              fieldName="companyName"
              placeholder="Повне ім’я назви фірми*"
              errors={errors}
              touched={touched}
              labelClassName="md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
            <CustomizedInput
              fieldName="phone"
              inputType="tel"
              placeholder="Телефон*"
              errors={errors}
              touched={touched}
              as={MaskedInput}
              mask={phoneMask}
              labelClassName="md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
            <CustomizedInput
              fieldName="license"
              placeholder="Номер ліцензії"
              errors={errors}
              touched={touched}
              labelClassName="md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
            <CustomizedInput
              fieldName="city"
              placeholder="Місто*"
              errors={errors}
              touched={touched}
              labelClassName="md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
            <CustomizedInput
              fieldName="password"
              inputType="password"
              placeholder="Пароль*"
              errors={errors}
              touched={touched}
              labelClassName="md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
            <CustomizedInput
              fieldName="site"
              placeholder="Сайт*"
              errors={errors}
              touched={touched}
              labelClassName="md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
            <CustomizedInput
              fieldName="legalCompanyName"
              placeholder="Юридична назва фірми"
              errors={errors}
              touched={touched}
              labelClassName="md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
            <CustomizedInput
              fieldName="country"
              placeholder="Країна*"
              errors={errors}
              touched={touched}
              labelClassName="md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
            <SubmitButton
              dirty={dirty}
              isValid={isValid}
              isLoading={isLoading}
              text="Зареєструватися"
              variant={variant}
              className="w-full md:w-[calc(50%-10px)] xl:w-[calc(50%-22.5px)]"
            />
          </div>
          <p className="max-w-[274px] xl:max-w-[262px] mt-4 mx-auto md:mr-0 text-12reg text-center md:text-left">
            Уже маєте аккаунт?&nbsp;
            <Link
              href="/auth/sign-in"
              className="text-12reg text-center xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            >
              Вхід в кабінет агента
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
