"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import MaskedInput from "react-text-mask";

import { agentInfoValidation } from "@/schemas/agentInfoFormValidation";
import { phoneMask } from "@/regex/regex";

import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";
import {ValuesSignUpFormType} from "@/components/shared/forms/SignUpForm";

export interface ValuesAgentInfoFormType {
  email: string;
  companyName: string;
  legalCompanyName?: string;
  site?: string;
  phone: string;
  edrpou?: string;
  city: string;
}

interface AgentInfoFormProps {
  initialValues: ValuesAgentInfoFormType;
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

const normalizeMaskedValue = (value: string) =>
    value.replace(/_/g, "").trim();


export default function AgentInfoForm({
                                        initialValues,
                                        setIsError,
                                        setIsNotificationShown,
                                        setIsPopUpShown,
                                        className = "",
                                        variant = "red",
                                      }: AgentInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (
      values: ValuesAgentInfoFormType,
      { resetForm }: FormikHelpers<ValuesAgentInfoFormType>
  ) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsNotificationShown(false);

      const payload = {
        ...values,
        edrpou: normalizeMaskedValue(values.edrpou),
        phone: normalizeMaskedValue(values.phone),
      };

      await axios.patch("/api/agent/profile", payload, {
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
                    placeholder="Повна назва компанії"
                    errors={errors}
                    touched={touched}
                />

                <CustomizedInput
                    fieldName="legalCompanyName"
                    placeholder="Юридична назва компанії"
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
                    fieldName="edrpou"
                    placeholder="ЄДРПОУ"
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
                    fieldName="site"
                    placeholder="Сайт"
                    errors={errors}
                    touched={touched}
                />

                <CustomizedInput fieldName="taxForm" as="select" errors={errors} touched={touched}>
                  <option value="fop">ФОП</option>
                  <option value="tov">ТОВ</option>
                  <option value="other">Інше</option>
                </CustomizedInput>
              </div>

              {/* Правая колонка */}
              <div className="flex flex-col gap-[18px] md:w-[calc(50%-10px)] xl:w-full">

                <CustomizedInput
                    fieldName="city"
                    placeholder="Місто"
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
