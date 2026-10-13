"use client";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dispatch, SetStateAction, useState } from "react";
import { resetPasswordSchema } from "../model/schemas";
import { CustomizedInput } from "@/shared/ui";
import { SubmitButton } from "@/shared/ui";

export type ValuesResetPasswordFormType = z.input<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
}

export default function ResetPasswordForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  className = "",
  variant = "red",
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    password: "",
    repeatPassword: "",
  };

  const methods = useForm<ValuesResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    values: initialValues,
    mode: "all",
  });
  const {
    reset,
    formState: { errors, touchedFields: touched, isDirty: dirty, isValid },
  } = methods;
  const submitForm = async (values: ValuesResetPasswordFormType) => {
    try {
      setIsLoading(true);
      reset();
      if (setIsPopUpShown) {
        setIsPopUpShown(false);
      }
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
            placeholder="Новий пароль"
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="repeatPassword"
            inputType="password"
            placeholder="Підтвердити новий пароль"
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
        <div className="mt-4 pt-4 border-t border-black">
          <Link
            href="/auth/sign-up"
            className="block text-12reg text-center xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
          >
            Створити новий доступ
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
