import * as yup from "yup";
import { emailRegex, phoneRegex } from "@/regex/regex";

export const agentInfoValidation = () =>
    yup.object({
          email: yup
              .string()
              .matches(emailRegex, "Введіть валідний email")
              .required("Дане поле обов'язкове до заповнення"),

          companyName: yup
              .string()
              .min(2, "Має бути не менше 2 символів")
              .required("Дане поле обов'язкове до заповнення"),

          legalCompanyName: yup
              .string()
              .min(2, "Має бути не менше 2 символів")
              .required("Дане поле обов'язкове до заповнення"),

          phone: yup
              .string()
              .matches(phoneRegex, "Вкажіть правильний номер телефону")
              .required("Дане поле обов'язкове до заповнення"),

          city: yup
              .string()
              .min(2, "Має бути не менше 2 символів")
              .required("Дане поле обов'язкове до заповнення"),

          site: yup
              .string()
              .notRequired()
              .test(
                  "is-valid-site",
                  "Посилання має починатися з https:// або www.",
                  (value) => {
                        if (!value) return true;
                        return /^(https:\/\/|www\.)/.test(value);
                  }
              ),

          taxForm: yup.string().required(),
    });
