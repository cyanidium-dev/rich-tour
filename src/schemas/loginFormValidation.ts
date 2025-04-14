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
      .min(6, "Має бути не менше 6 символів")
      .matches(/[A-Za-zА-Яа-яІіЇїЄєҐґ]/, "Має містити хоча б одну літеру")
      .matches(/\d/, "Має містити хоча б одну цифру")
      .required("Дане поле обов'язкове до заповнення"),
  });

  return loginFormValidationSchema;
};
