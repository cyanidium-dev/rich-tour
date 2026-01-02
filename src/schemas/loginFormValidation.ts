import * as yup from "yup";
import { emailRegex } from "@/regex/regex";

const loginRegex = /^[a-zA-Z0-9._-]{3,}$/;

export const loginValidation = () => {
  return yup.object().shape({
    email: yup
        .string()
        .required("Дане поле обов'язкове до заповнення")
        .test(
            "email-or-login",
            "Введіть валідний email або login",
            (value) => {
              if (!value) return false;

              // email агента
              if (emailRegex.test(value)) return true;

              // login агенції
              if (loginRegex.test(value)) return true;

              return false;
            }
        ),

    password: yup
        .string()
        .required("Дане поле обов'язкове до заповнення"),
  });
};
