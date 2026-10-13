"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import { agencyProfileSchema } from "../model/schemas";
import { CustomizedInput } from "@/shared/ui";
import { SubmitButton } from "@/shared/ui";

export type ValuesAgencyInfoFormType = z.input<typeof agencyProfileSchema>;

interface AgencyInfoFormProps {
  initialValues: ValuesAgencyInfoFormType;
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

const normalizeMaskedValue = (value?: string) => value?.replace(/_/g, "").trim() ?? "";

export default function AgencyInfoForm({
  initialValues,
  setIsError,
  setIsNotificationShown,
  className = "",
  variant = "red",
}: AgencyInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ValuesAgencyInfoFormType>({
    resolver: zodResolver(agencyProfileSchema),
    values: initialValues,
    mode: "all",
  });
  const {
    reset,
    formState: { errors, touchedFields: touched, isDirty: dirty, isValid },
  } = methods;
  const submitForm = async (values: ValuesAgencyInfoFormType) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsNotificationShown(false);

      const payload = {
        ...values,
        agencyEdrpou: normalizeMaskedValue(values.agencyEdrpou),
        agencyPhone: normalizeMaskedValue(values.agencyPhone),
      };

      await axios.patch("/api/agency/profile", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      reset(values);
      setIsNotificationShown(true);
    } catch {
      setIsError(true);
      setIsNotificationShown(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitForm)}
        className={`${className} flex flex-col md:flex-row xl:flex-col gap-y-[18px] gap-x-5`}
      >
        <div className="flex flex-col gap-[18px] md:w-[calc(50%-10px)] xl:w-full">
          <CustomizedInput
            fieldName="legalAgencyName"
            placeholder="Офіційна назва агенції"
            errors={errors}
            touched={touched}
          />

          <CustomizedInput
            fieldName="marketingAgencyName"
            placeholder="Маркетингова назва агенції"
            errors={errors}
            touched={touched}
          />

          <CustomizedInput
            fieldName="login"
            placeholder="Логін"
            errors={errors}
            touched={touched}
          />

          <CustomizedInput
            fieldName="agencyEdrpou"
            placeholder="ЄДРПОУ агенції"
            errors={errors}
            touched={touched}
          />

          <CustomizedInput
            fieldName="agencyCity"
            placeholder="Місто реєстрації"
            errors={errors}
            touched={touched}
          />

          <CustomizedInput
            fieldName="agencyLegalAddress"
            placeholder="Адреса реєстрації"
            errors={errors}
            touched={touched}
          />

          <CustomizedInput
            fieldName="agencyEmail"
            inputType="email"
            placeholder="Пошта агенції"
            errors={errors}
            touched={touched}
          />

          <CustomizedInput
            fieldName="agencyPhone"
            inputType="tel"
            placeholder="Телефон агенції"
            errors={errors}
            touched={touched}
            mask="phone"
          />

          <CustomizedInput
            fieldName="mainOfficeEmail"
            inputType="email"
            placeholder="Email головного офісу"
            errors={errors}
            touched={touched}
          />

          <SubmitButton isLoading={isLoading} text="Оновити" variant={variant} />
        </div>
      </form>
    </FormProvider>
  );
}
