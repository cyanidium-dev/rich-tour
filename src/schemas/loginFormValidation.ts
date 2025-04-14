import * as yup from "yup";
import { emailRegex } from "@/regex/regex";

export const loginValidation = () => {
  const loginFormValidationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(emailRegex, "Введіть валідний email")
      .required("Дане поле обов'язкове до заповнення"),
    password: yup
      .string()
      .min(8, "Пароль має бути не менше 8 символів")
      .required("Дане поле обов'язкове до заповнення"),
  });

  return loginFormValidationSchema;
};
