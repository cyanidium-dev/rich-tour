"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import MaskedInput from "react-text-mask";

import { agentInfoValidation } from "@/schemas/agentInfoFormValidation";
import { phoneMask } from "@/regex/regex";

import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesAgentInfoFormType {
  email: string;
  companyName: string;
  site?: string;
  phone: string;
  license?: string;
  country: string;
  city: string;
  legalAddress?: string;
  actualAddress?: string;
}

interface AgentInfoFormProps {
  initialValues: ValuesAgentInfoFormType;
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

export default function AgentInfoForm({
                                        initialValues,
                                        setIsError,
                                        setIsNotificationShown,
                                        setIsPopUpShown,
                                        className = "",
                                        variant = "red",
                                      }: AgentInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
console.log(initialValues)
  const submitForm = async (
      values: ValuesAgentInfoFormType,
      { resetForm }: FormikHelpers<ValuesAgentInfoFormType>
  ) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsNotificationShown(false);

      await axios.patch("/api/agent/profile", values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      resetForm({ values });
      setIsNotificationShown(true);
      setIsPopUpShown?.(false);
    } catch {
      setIsError(true);
      setIsNotificationShown(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Formik
          initialValues={initialValues}
          validationSchema={agentInfoValidation()}
          onSubmit={submitForm}
          enableReinitialize
      >
        {({ errors, touched, dirty, isValid }) => (
            <Form
                className={`${className} flex flex-col md:flex-row xl:flex-col gap-y-[18px] gap-x-5`}
            >
              {/* Левая колонка */}
              <div className="flex flex-col gap-[18px] md:w-[calc(50%-10px)] xl:w-full">
                <CustomizedInput
                    fieldName="email"
                    inputType="email"
                    placeholder="Email"
                    errors={errors}
                    touched={touched}
                />

                <CustomizedInput
                    fieldName="companyName"
                    placeholder="Повне ім’я назви фірми"
                    errors={errors}
                    touched={touched}
                />

                <CustomizedInput
                    fieldName="site"
                    placeholder="Сайт"
                    errors={errors}
                    touched={touched}
                />

                <CustomizedInput
                    fieldName="phone"
                    inputType="tel"
                    placeholder="Телефон"
                    errors={errors}
                    touched={touched}
                    as={MaskedInput}
                    mask={phoneMask}
                />

                <CustomizedInput
                    fieldName="license"
                    placeholder="Номер ліцензії"
                    errors={errors}
                    touched={touched}
                />
              </div>

              {/* Правая колонка */}
              <div className="flex flex-col gap-[18px] md:w-[calc(50%-10px)] xl:w-full">
                <CustomizedInput
                    fieldName="country"
                    placeholder="Країна"
                    errors={errors}
                    touched={touched}
                />

                <CustomizedInput
                    fieldName="city"
                    placeholder="Місто"
                    errors={errors}
                    touched={touched}
                />

                <CustomizedInput
                    fieldName="legalAddress"
                    placeholder="Юридична адреса"
                    errors={errors}
                    touched={touched}
                />

                <CustomizedInput
                    fieldName="actualAddress"
                    placeholder="Фактична адреса"
                    errors={errors}
                    touched={touched}
                />

                <SubmitButton
                    dirty={dirty}
                    isValid={isValid}
                    isLoading={isLoading}
                    text="Оновити"
                    variant={variant}
                />
              </div>
            </Form>
        )}
      </Formik>
  );
}
