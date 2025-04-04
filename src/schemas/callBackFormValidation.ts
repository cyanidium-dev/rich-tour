import * as yup from "yup";
import { nameRegex, phoneRegex } from "@/regex/regex";

export const callBackValidation = () => {
  const checkoutFormValidationSchema = yup.object().shape({
    name: yup
      .string()
      .min(2, "Ім’я повинно містити від 2 до 30 символів")
      .max(30, "Ім’я повинно містити від 2 до 30 символів")
      .matches(nameRegex, "Допустимі літери та дефіс, апостроф, лапки")
      .required("Дане поле є обов'язковим до заповнення"),
    phone: yup
      .string()
      .matches(phoneRegex, "Вкажіть правильний номер телефону")
      .test(
        "sixth-char-zero",
        "Після +38 має бути цифра 0",
        (value) => !!value && value.length >= 6 && value[5] === "0"
      )
      .required("Дане поле є обов'язковим до заповнення"),
    address: yup
      .string()
      .min(10, "Адреса має містити від 10 до 300 символів")
      .max(300, "Адреса має містити від 10 до 300 символів")
      .required("Дане поле є обов'язковим до заповнення"),
    payment: yup.string().required("Дане поле є обов'язковим до заповнення"),
  });

  return checkoutFormValidationSchema;
};
