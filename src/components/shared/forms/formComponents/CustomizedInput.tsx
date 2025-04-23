import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import MaskedInput from "react-text-mask";
import { useFormikContext } from "formik";
import { ValuesBookingFormType } from "../BookingForm";

interface Values {
  [fieldName: string]: string;
}

interface CustomizedInputProps {
  fieldName: string;
  placeholder: string;
  errors: FormikErrors<Values> | FormikErrors<ValuesBookingFormType>;
  touched: FormikTouched<Values> | FormikTouched<ValuesBookingFormType>;
  as?: string | typeof MaskedInput;
  labelClassName?: string;
  wrapperClassName?: string;
  fieldClassName?: string;
  mask?: string | RegExp | (string | RegExp)[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  inputType?: string;
}

const labelStyles = "relative flex flex-col w-full";
const fieldStyles =
  "relative w-full px-4 py-3 text-12reg text-black placeholder-black border rounded-[6px] outline-none resize-none transition duration-300 ease-out";
const errorStyles = "absolute bottom-[-14px] left-2 text-9reg text-red";

export default function CustomizedInput({
  errors,
  touched,
  fieldName,
  placeholder = "",
  as,
  labelClassName = "",
  wrapperClassName = "",
  fieldClassName = "",
  mask = "",
  onChange,
  onFocus,
  onBlur,
  inputType = "text",
}: CustomizedInputProps) {
  const { handleChange } = useFormikContext();

  const isError = (errors as Record<string, unknown>)[fieldName];
  const isTouched = (touched as Record<string, unknown>)[fieldName];

  return (
    <label className={`${labelStyles} ${labelClassName}`}>
      <div className={`${wrapperClassName}`}>
        <Field
          as={as}
          mask={mask}
          name={fieldName}
          type={inputType}
          autoComplete="on"
          placeholder={placeholder}
          onChange={onChange || handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`${fieldStyles} ${
            as === "textarea" ? "h-[105px]" : ""
          } ${fieldClassName} ${
            isError && isTouched
              ? "border-red"
              : "border-black focus:border-green"
          }`}
        />
      </div>
      <ErrorMessage name={fieldName} component="p" className={errorStyles} />
    </label>
  );
}
