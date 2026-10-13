"use client";
import type { ChangeEvent, FocusEvent } from "react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import { MaskedInput, type InputMask } from "@/shared/ui";
import type { BookingValues } from "../model/schemas";
interface Props {
  fieldName: string;
  placeholder?: string;
  as?: "textarea";
  mask?: InputMask;
  inputType?: string;
  labelClassName?: string;
  fieldFontSize?: string;
  disabled?: boolean;
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function BookingInput({
  fieldName,
  placeholder,
  as,
  mask,
  inputType = "text",
  labelClassName = "",
  fieldFontSize = "text-12reg",
  disabled,
  onFocus,
  onChange,
}: Props) {
  const { register, control, getFieldState, formState } = useFormContext<BookingValues>();
  const name = fieldName.replace(/\[(\d+)\]/g, ".$1") as FieldPath<BookingValues>;
  const { error, isTouched } = getFieldState(name, formState);
  const visible = !!error && (isTouched || formState.isSubmitted);
  const props = {
    placeholder,
    type: inputType,
    autoComplete: "on",
    disabled,
    onFocus,
    className: `relative w-full px-4 py-3 h-10 text-black placeholder-black border rounded-[6px] outline-none resize-none transition duration-300 ease-out ${as === "textarea" ? "h-[105px]" : ""} ${fieldFontSize} ${visible ? "border-red" : "border-black"} ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`,
  };
  return (
    <label className={`relative flex flex-col w-full ${labelClassName}`}>
      <div className="relative">
        {mask ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <MaskedInput
                {...props}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={String(field.value ?? "")}
                maskType={mask}
                onChange={onChange ?? field.onChange}
              />
            )}
          />
        ) : as === "textarea" ? (
          <textarea {...props} {...register(name)} />
        ) : (
          <input {...props} {...register(name)} onChange={onChange ?? register(name).onChange} />
        )}
      </div>
      {visible && (
        <p className="absolute bottom-[-12px] left-2 text-9reg text-red">{error.message}</p>
      )}
    </label>
  );
}
