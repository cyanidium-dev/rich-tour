"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import { agentProfileSchema } from "../model/schemas";

import { CustomizedInput } from "@/shared/ui";
import { SubmitButton } from "@/shared/ui";

export type ValuesAgentInfoFormType = z.input<typeof agentProfileSchema>;

interface AgentInfoFormProps {
  initialValues: ValuesAgentInfoFormType;
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

const normalizeMaskedValue = (value: string) => value.replace(/_/g, "").trim();

export default function AgentInfoForm({
  initialValues,
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  className = "",
  variant = "red",
}: AgentInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ValuesAgentInfoFormType>({
    resolver: zodResolver(agentProfileSchema),
    values: initialValues,
    mode: "all",
  });
  const {
    reset,
    formState: { errors, touchedFields: touched, isDirty: dirty, isValid },
  } = methods;
  const submitForm = async (values: ValuesAgentInfoFormType) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsNotificationShown(false);

      const payload = {
        ...values,
        edrpou: normalizeMaskedValue(values.edrpou ?? ""),
        phone: normalizeMaskedValue(values.phone),
      };

      await axios.patch("/api/agent/profile", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      reset(values);
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
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitForm)}
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
            mask="phone"
          />

          <CustomizedInput
            fieldName="edrpou"
            placeholder="ЄДРПОУ"
            errors={errors}
            touched={touched}
          />

          <CustomizedInput fieldName="city" placeholder="Місто" errors={errors} touched={touched} />

          <CustomizedInput fieldName="site" placeholder="Сайт" errors={errors} touched={touched} />

          <CustomizedInput fieldName="taxForm" as="select" errors={errors} touched={touched}>
            <option value="fop">ФОП</option>
            <option value="tov">ТОВ</option>
            <option value="other">Інше</option>
          </CustomizedInput>

          <SubmitButton
            dirty={dirty}
            isValid={isValid}
            isLoading={isLoading}
            text="Оновити"
            variant={variant}
          />
        </div>
      </form>
    </FormProvider>
  );
}
