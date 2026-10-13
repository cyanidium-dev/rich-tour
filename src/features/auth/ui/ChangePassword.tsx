"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dispatch, SetStateAction, useState } from "react";
import { resetPasswordSchema } from "../model/schemas";
import { CustomizedInput } from "@/shared/ui";
import { SubmitButton } from "@/shared/ui";
import axios from "axios";
import {
  getRememberedCredentials,
  saveRememberedCredentials,
} from "@/lib/auth/rememberedCredentials";

export type ValuesChangePasswordFormType = z.input<typeof resetPasswordSchema>;

interface ChangePasswordFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

export default function ChangePasswordForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  className = "",
  variant = "red",
}: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    password: "",
    repeatPassword: "",
  };

  const methods = useForm<ValuesChangePasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    values: initialValues,
    mode: "all",
  });
  const {
    reset,
    formState: { errors, touchedFields: touched, isDirty: dirty, isValid },
  } = methods;
  const submitForm = async (values: ValuesChangePasswordFormType) => {
    try {
      setIsError(false);
      setIsLoading(true);

      await axios.post(
        "/api/auth/change-password",
        {
          password: values.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const saved = getRememberedCredentials();
      if (saved) saveRememberedCredentials({ ...saved, password: values.password });
      reset();
      setIsPopUpShown?.(false);
    } catch (error) {
      setIsError(true);
      return error;
    } finally {
      setIsLoading(false);
      setIsNotificationShown(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitForm)} className={`${className}`}>
        <div className="flex flex-col w-full h-full gap-y-5 mb-[18px]">
          <CustomizedInput
            fieldName="password"
            inputType="password"
            placeholder="Створити пароль"
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="repeatPassword"
            inputType="password"
            placeholder="Новий пароль"
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
      </form>
    </FormProvider>
  );
}
