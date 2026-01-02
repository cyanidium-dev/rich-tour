import * as yup from "yup";

export const resetPasswordValidation = () => {
  return yup.object().shape({
    password: yup
        .string()
        .required("Дане поле обов'язкове до заповнення"),

    repeatPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Паролі повинні співпадати")
        .required("Дане поле обов'язкове до заповнення"),
  });
};
