import * as yup from "yup";
import { emailRegex, phoneRegex } from "@/regex/regex";

export const agentInfoValidation = () => {
  const agentInfoFormValidationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(emailRegex, "Введіть валідний email")
      .required("Дане поле обов'язкове до заповнення"),
    companyName: yup
      .string()
      .min(2, "Має бути не менше 2 символів")
      .required("Дане поле обов'язкове до заповнення"),
    site: yup
      .string()
      .min(2, "Має бути не менше 2 символів")
      .matches(
        /^(https:\/\/|www\.)/,
        "Посилання має починатися з https:// або www."
      )
      .required("Дане поле обов'язкове до заповнення"),
    phone: yup
      .string()
      .matches(phoneRegex, "Вкажіть правильний номер телефону")
      .test(
        "sixth-char-zero",
        "Після +38 має бути цифра 0",
        (value) => !!value && value.length >= 6 && value[5] === "0"
      )
      .required("Дане поле обов'язкове до заповнення"),
    license: yup.string().min(2, "Має бути не менше 2 символів"),
    country: yup
      .string()
      .min(2, "Має бути не менше 2 символів")
      .required("Дане поле обов'язкове до заповнення"),
    city: yup
      .string()
      .min(2, "Має бути не менше 2 символів")
      .required("Дане поле обов'язкове до заповнення"),
    legalAddress: yup.string().min(2, "Має бути не менше 2 символів"),
    actualAddress: yup.string().min(2, "Має бути не менше 2 символів"),
  });

  return agentInfoFormValidationSchema;
};
