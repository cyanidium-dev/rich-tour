"use client";

import {
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef,
  useCallback,
} from "react";
import { IMaskInput } from "react-imask";

export type InputMask = "phone" | "date" | "passport" | "edrpou";

type MaskedInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "onChange" | "value"
> & {
  maskType: InputMask;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const maskOptions: Record<
  InputMask,
  {
    mask: string;
    definitions?: Record<string, RegExp>;
    prepareChar?: (value: string) => string;
  }
> = {
  phone: {
    mask: "+{38} (000) 000-00-00",
  },
  date: {
    mask: "00.00.0000",
  },
  passport: {
    mask: "AA000000",
    definitions: {
      A: /[A-Za-z]/,
    },
    prepareChar: (value) => value.toUpperCase(),
  },
  edrpou: {
    mask: "0000000000",
  },
};

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput(
    { maskType, name, onChange, type = "text", value = "", ...props },
    ref
  ) {
    const options = maskOptions[maskType];
    const handleAccept = useCallback(
      (nextValue: string) => {
        if (!onChange) return;

        onChange({
          target: {
            name,
            type,
            value: nextValue,
          },
          currentTarget: {
            name,
            type,
            value: nextValue,
          },
        } as ChangeEvent<HTMLInputElement>);
      },
      [name, onChange, type]
    );

    return (
      <IMaskInput
        {...props}
        {...options}
        inputRef={ref}
        lazy
        name={name}
        type={type}
        value={value}
        onAccept={handleAccept}
      />
    );
  }
);

export default MaskedInput;
