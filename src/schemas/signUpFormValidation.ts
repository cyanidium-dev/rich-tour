import * as yup from "yup";
import { emailRegex, phoneRegex } from "@/regex/regex";

export const signUpValidation = () => {
  const signUpFormValidationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(emailRegex, "Введіть валідний email")
      .required("Дане поле обов'язкове до заповнення"),
    companyName: yup
      .string()
      .min(2, "Має бути не менше 2 символів")
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
    city: yup
      .string()
      .min(2, "Має бути не менше 2 символів")
      .required("Дане поле обов'язкове до заповнення"),
    password: yup
      .string()
      .min(6, "Має бути не менше 6 символів")
      .matches(/[A-Za-zА-Яа-яІіЇїЄєҐґ]/, "Має містити хоча б одну літеру")
      .matches(/\d/, "Має містити хоча б одну цифру")
      .required("Дане поле обов'язкове до заповнення"),
    site: yup
      .string()
      .min(2, "Має бути не менше 2 символів")
      .matches(
        /^(https:\/\/|www\.)/,
        "Посилання має починатися з https:// або www."
      )
      .required("Дане поле обов'язкове до заповнення"),
    legalCompanyName: yup.string().min(2, "Має бути не менше 2 символів"),
    country: yup
      .string()
      .min(2, "Має бути не менше 2 символів")
      .required("Дане поле обов'язкове до заповнення"),
  });

  return signUpFormValidationSchema;
};
