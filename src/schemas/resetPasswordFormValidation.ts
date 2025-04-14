import * as yup from "yup";

export const resetPasswordValidation = () => {
  const resetPasswordFormValidationSchema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Має бути не менше 6 символів")
      .matches(/[A-Za-zА-Яа-яІіЇїЄєҐґ]/, "Має містити хоча б одну літеру")
      .matches(/\d/, "Має містити хоча б одну цифру")
      .required("Дане поле обов'язкове до заповнення"),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Паролі повинні співпадати")
      .required("Дане поле обов'язкове до заповнення"),
  });

  return resetPasswordFormValidationSchema;
};
