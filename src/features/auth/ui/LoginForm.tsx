"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "../model/schemas";
import { CustomizedInput } from "@/shared/ui";
import { SubmitButton } from "@/shared/ui";
import axios from "axios";
import {
  clearRememberedCredentials,
  getRememberedCredentials,
  saveRememberedCredentials,
} from "@/lib/auth/rememberedCredentials";

export type ValuesLoginFormType = z.input<typeof loginSchema>;

interface LoginFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  setErrorMessage?: Dispatch<SetStateAction<string>>;
  className?: string;
  variant?: "red" | "black";
}

export default function LoginForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  setErrorMessage,
  className = "",
  variant = "red",
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const initialValues: ValuesLoginFormType = {
    email: "",
    password: "",
  };

  const methods = useForm<ValuesLoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialValues,
    mode: "all",
  });
  const {
    reset,
    formState: { errors, touchedFields: touched, isDirty: dirty, isValid },
  } = methods;

  useEffect(() => {
    const saved = getRememberedCredentials();
    if (saved) {
      reset(saved);
      setRememberMe(true);
    }
  }, [reset]);

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked) clearRememberedCredentials();
  };

  const submitForm = async (values: ValuesLoginFormType) => {
    try {
      setIsError(false);
      setIsNotificationShown(false);
      setIsLoading(true);

      const { data } = await axios.post("/api/auth/login", { ...values, rememberMe });

      const destination =
        data.role === "agent" ? "/agent" : data.role === "agency" ? "/agency" : null;
      if (!destination) throw new Error("UNKNOWN_ROLE");

      if (rememberMe) saveRememberedCredentials(values);
      else clearRememberedCredentials();

      reset();
      setIsPopUpShown?.(false);
      window.location.assign(destination);
    } catch (error) {
      setIsError(true);
      setIsNotificationShown(true);
      const message =
        axios.isAxiosError(error) && typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : error instanceof Error
            ? error.message
            : "LOGIN_FAILED";
      setErrorMessage?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitForm)} className={className}>
        <div className="flex flex-col w-full gap-y-5 mb-[18px]">
          <CustomizedInput
            fieldName="email"
            inputType="text"
            autoComplete="username"
            placeholder="Вкажіть email або login"
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="password"
            inputType="password"
            autoComplete="current-password"
            placeholder="Ваш пароль"
            errors={errors}
            touched={touched}
          />
        </div>

        <label className="mb-4 flex w-fit cursor-pointer items-center gap-2 text-12reg text-black">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => handleRememberMeChange(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-main focus-visible:outline-2 focus-visible:outline-main"
          />
          Запам’ятати мене
        </label>

        <p className="mb-4 text-12reg text-center">
          Забули пароль?{" "}
          <Link href="/auth/forgot-password" className="hover:text-main">
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
          <Link href="/auth/sign-up" className="block text-12reg text-center hover:text-main">
            Створити новий доступ
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
