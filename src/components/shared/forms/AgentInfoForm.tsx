"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import MaskedInput from "react-text-mask";
import axios from "axios";

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
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

export default function AgentInfoForm({
                                        setIsError,
                                        setIsNotificationShown,
                                        className = "",
                                        variant = "red",
                                      }: AgentInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // ❗ ВАЖНО: эти данные в реальности ты подставишь
  // из getAuthUser() или server component → props
  const initialValues: ValuesAgentInfoFormType = {
    email: "agent@test.com",
    companyName: "Rich Tour Agent",
    site: "",
    phone: "+380501234567",
    license: "",
    country: "Україна",
    city: "Київ",
    legalAddress: "",
    actualAddress: "",
  };

  const submitForm = async (
      values: ValuesAgentInfoFormType,
      formikHelpers: FormikHelpers<ValuesAgentInfoFormType>
  ) => {
    try {
      setIsError(false);
      setIsLoading(true);

      await axios.put("/api/agent/profile", values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setIsNotificationShown(true);
    } catch (error) {
      console.error(error);
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
          validateOnMount
      >
        {({ errors, touched, isValid }) => (
            <Form
                className={`${className} grid grid-cols-1 md:grid-cols-2 gap-5`}
            >
              <CustomizedInput
                  fieldName="email"
                  inputType="email"
                  placeholder="Email"
                  errors={errors}
                  touched={touched}
              />

              <CustomizedInput
                  fieldName="companyName"
                  placeholder="Повне імʼя / Назва фірми"
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
                  as={MaskedInput}
                  mask={phoneMask}
                  placeholder="Телефон"
                  errors={errors}
                  touched={touched}
              />

              <CustomizedInput
                  fieldName="license"
                  placeholder="Номер ліцензії"
                  errors={errors}
                  touched={touched}
              />

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

              <div className="md:col-span-2">
                <SubmitButton
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
