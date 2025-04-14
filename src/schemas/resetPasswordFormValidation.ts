import * as yup from "yup";
import { emailRegex } from "@/regex/regex";

export const resetPasswordValidation = () => {
  const resetPasswordFormValidationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(emailRegex, "Введіть валідний email")
      .required("Дане поле обов'язкове до заповнення"),
  });

  return resetPasswordFormValidationSchema;
};
