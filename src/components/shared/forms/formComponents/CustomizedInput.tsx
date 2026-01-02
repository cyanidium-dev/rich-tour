import { Field, ErrorMessage, FormikErrors, FormikTouched, useFormikContext } from "formik";
import MaskedInput from "react-text-mask";
import { ReactNode } from "react";

interface GenericValues {
  [key: string]: any;
}

interface CustomizedInputProps {
  fieldName: string;
  placeholder?: string;

  errors: FormikErrors<GenericValues>;
  touched: FormikTouched<GenericValues>;

  as?: string | typeof MaskedInput;
  mask?: string | RegExp | (string | RegExp)[];

  inputType?: string;

  labelClassName?: string;
  wrapperClassName?: string;
  fieldClassName?: string;
  fieldFontSize?: string;

  onChange?: (e: React.ChangeEvent<any>) => void;
  onFocus?: (e: React.FocusEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;

  isLoading?: boolean;

  children?: ReactNode;
}

const labelBaseStyles = "relative flex flex-col w-full";
const fieldBaseStyles =
    "relative w-full px-4 py-3 h-10 text-black placeholder-black border rounded-[6px] outline-none resize-none transition duration-300 ease-out";
const errorStyles = "absolute bottom-[-12px] left-2 text-9reg text-red";

export default function CustomizedInput({
                                          fieldName,
                                          placeholder = "",

                                          errors,
                                          touched,

                                          as,
                                          mask,
                                          inputType = "text",

                                          labelClassName = "",
                                          wrapperClassName = "",
                                          fieldClassName = "",
                                          fieldFontSize = "text-12reg",

                                          onChange,
                                          onFocus,
                                          onBlur,

                                          isLoading = false,
                                          children,
                                        }: CustomizedInputProps) {
  const { handleChange } = useFormikContext<GenericValues>();

  const isError = Boolean(errors?.[fieldName]);
  const isTouched = Boolean(touched?.[fieldName]);

  return (
      <label className={`${labelBaseStyles} ${labelClassName}`}>
        <div className={wrapperClassName}>
          <Field
              name={fieldName}
              as={as}
              mask={mask}
              type={inputType}
              placeholder={placeholder}
              autoComplete="on"
              disabled={isLoading}
              onChange={onChange || handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              className={`
            ${fieldBaseStyles}
            ${as === "textarea" ? "h-[105px]" : ""}
            ${fieldClassName}
            ${fieldFontSize}
            ${isError && isTouched ? "border-red" : "border-black"}
          `}
          >
            {children}
          </Field>
        </div>

        <ErrorMessage
            name={fieldName}
            component="p"
            className={errorStyles}
        />
      </label>
  );
}
