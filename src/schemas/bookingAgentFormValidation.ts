import * as yup from "yup";
import { latinNameRegex, phoneRegex, emailRegex } from "@/regex/regex";

export const bookingAgentValidation = () => {
  const travelerSchema = yup.object().shape({
    name: yup
      .string()
      .matches(latinNameRegex, "Ім’я повинне бути латиницею")
      .required("Вкажіть ім’я"),
    surname: yup
      .string()
      .matches(latinNameRegex, "Прізвище повинне бути латиницею")
      .required("Вкажіть прізвище"),
    phone: yup
      .string()
      .matches(phoneRegex, "Вкажіть правильний номер телефону")
      .notRequired()
      .nullable(),
    passport: yup.string().required("Вкажіть номер паспорта"),
    birthDate: yup.string().required("Вкажіть дату народження"),
    passportExpiration: yup
      .string()
      .required("Вкажіть дату закінчення дії паспорта"),
    boardingCity: yup.string().required("Вкажіть місто посадки"),
  });

  const bookingAgentFormValidationSchema = yup.object().shape({
    travelersQty: yup
      .number()
      .typeError("Кількість туристів повинна бути числом")
      .integer("Кількість туристів повинна бути цілим числом")
      .positive("Кількість туристів повинна бути додатньою")
      .required("Вкажіть кількість туристів"),
    agency: yup.string().required("Дане поле обов'язкове до заповнення"),
    manager: yup.string().required("Дане поле обов'язкове до заповнення"),
    email: yup
      .string()
      .matches(emailRegex, "Введіть валідний email")
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
    message: yup.string().max(200, "Повинно містити не більше 200 символів"),
    travelers: yup
      .array()
      .of(travelerSchema)
      .min(1, "Має бути хоча б один турист")
      .required("Має бути хоча б один турист"),
  });

  return bookingAgentFormValidationSchema;
};
