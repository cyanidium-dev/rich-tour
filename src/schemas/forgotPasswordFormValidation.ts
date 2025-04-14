import * as yup from "yup";
import { emailRegex } from "@/regex/regex";

export const forgotPasswordValidation = () => {
  const forgotPasswordFormValidationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(emailRegex, "Введіть валідний email")
      .required("Дане поле обов'язкове до заповнення"),
  });

  return forgotPasswordFormValidationSchema;
};
