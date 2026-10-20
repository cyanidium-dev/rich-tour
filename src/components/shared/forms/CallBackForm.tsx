"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomizedInput, SubmitButton } from "@/shared/ui";
import { callBackValidation, type ValuesCallBackFormType } from "@/schemas/callBackFormValidation";
export type { ValuesCallBackFormType } from "@/schemas/callBackFormValidation";

interface CallBackFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  variant?: "red" | "black";
  fieldsClassName?: string;
  onSubmit?: (values: ValuesCallBackFormType) => Promise<void>;
  validationSchema?: ReturnType<typeof callBackValidation>;
}

export default function CallBackForm({
  setIsError,
  setIsNotificationShown,
  setIsPopUpShown,
  className = "",
  variant = "red",
  fieldsClassName = "flex flex-col w-full h-full gap-y-5 mb-[18px]",
  onSubmit,
  validationSchema,
}: CallBackFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<ValuesCallBackFormType>({
    resolver: zodResolver(validationSchema ?? callBackValidation()),
    defaultValues: { name: "", phone: "", message: "" },
    mode: "onChange",
  });

  const submitForm = async (values: ValuesCallBackFormType) => {
    try {
      setIsLoading(true);
      setIsError(false);
      await onSubmit?.(values);
      methods.reset();
      setIsPopUpShown?.(false);
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
      <form className={className} onSubmit={methods.handleSubmit(submitForm)}>
        <div className={fieldsClassName}>
          <CustomizedInput fieldName="name" placeholder="Ім’я" />
          <CustomizedInput
            fieldName="phone"
            inputType="tel"
            placeholder="Номер телефону"
            mask="phone"
          />
          <CustomizedInput fieldName="message" as="textarea" placeholder="Повідомлення" />
        </div>
        <SubmitButton isLoading={isLoading} text="Відправити" variant={variant} />
      </form>
    </FormProvider>
  );
}
