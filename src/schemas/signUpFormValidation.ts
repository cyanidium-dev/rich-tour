import * as yup from "yup";
import { emailRegex, phoneRegex, edrpouRegex } from "@/regex/regex";

export const signUpValidation = () =>
    yup.object().shape({
        email: yup
            .string()
            .matches(emailRegex, "Введіть валідний email")
            .required("Обовʼязкове поле"),

        companyName: yup
            .string()
            .min(2)
            .required("Обовʼязкове поле"),

        legalCompanyName: yup
            .string()
            .min(2)
            .required("Обовʼязкове поле"),

        phone: yup
            .string()
            .matches(phoneRegex, "Некоректний номер")
            .required("Обовʼязкове поле"),

        edrpou: yup
            .string()
            .transform((v) => (v ?? "").replace(/\D/g, ""))
            .matches(edrpouRegex, "ЄДРПОУ має містити 8–10 цифр")
            .required("Обовʼязкове поле"),

        city: yup
            .string()
            .min(2)
            .required("Обовʼязкове поле"),

        taxForm: yup
            .string()
            .oneOf(["fop", "tov", "other"])
            .required("Обовʼязкове поле"),

        password: yup
            .string()
            .min(6)
            .required("Обовʼязкове поле"),

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
    });
