"use client";
import { ReactNode, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import MaskedInput, { InputMask } from "./MaskedInput";
interface Props {
  fieldName: string;
  placeholder?: string;
  errors?: unknown;
  touched?: unknown;
  as?: "select" | "textarea";
  mask?: InputMask;
  inputType?: string;
  autoComplete?: string;
  children?: ReactNode;
}
export default function Input({
  fieldName,
  placeholder = "",
  as,
  mask,
  inputType = "text",
  autoComplete = "on",
  children,
}: Props) {
  const {
    register,
    control,
    formState: { errors, touchedFields, isSubmitted },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[fieldName];
  const visible = error && (touchedFields[fieldName] || isSubmitted);
  const props = {
    type: inputType === "password" && showPassword ? "text" : inputType,
    placeholder,
    autoComplete,
    "aria-label": placeholder || fieldName,
    className: `relative w-full px-4 py-3 ${inputType === "password" ? "pr-12" : ""} h-10 text-black placeholder-black border rounded-[6px] outline-none resize-none transition duration-300 ease-out text-12reg ${visible ? "border-red" : "border-black"}`,
  };
  const Tag = as ?? "input";
  return (
    <div className="relative flex flex-col w-full">
      <div className="relative">
        {mask ? (
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <MaskedInput {...props} {...field} value={field.value ?? ""} maskType={mask} />
            )}
          />
        ) : (
          <label>
            <Tag {...props} {...register(fieldName)}>
              {children}
            </Tag>
          </label>
        )}
        {inputType === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
            aria-pressed={showPassword}
            className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-black transition-colors hover:text-main focus-visible:text-main focus-visible:outline-2 focus-visible:outline-main focus-visible:outline-offset-[-2px]"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {showPassword ? (
                <>
                  <path d="M4.3 4.3 19.7 19.7" />
                  <path d="M9.8 9.8a3 3 0 0 0 4.4 4.4" />
                  <path d="M6.7 6.7C4.7 8 3.2 9.8 2.5 12c1.5 4.4 5.1 7 9.5 7 1.8 0 3.5-.5 5-1.4" />
                  <path d="M17.3 17.3c2-1.3 3.5-3.1 4.2-5.3-1.5-4.4-5.1-7-9.5-7-1.8 0-3.5.5-5 1.4" />
                </>
              ) : (
                <>
                  <path d="M2.5 12c1.5-4.4 5.1-7 9.5-7s8 2.6 9.5 7c-1.5 4.4-5.1 7-9.5 7s-8-2.6-9.5-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
      {visible && (
        <p className="absolute bottom-[-12px] left-2 text-9reg text-red">{String(error.message)}</p>
      )}
    </div>
  );
}
