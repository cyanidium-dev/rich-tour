import * as yup from "yup";
import { edrpouRegex, emailRegex, phoneRegex } from "@/regex/regex";

export const agencyInfoValidation = () =>
    yup.object({
        legalAgencyName: yup
            .string()
            .min(2, "Має бути не менше 2 символів")
            .required("Дане поле обов'язкове до заповнення"),

        marketingAgencyName: yup.string().notRequired(),

        login: yup
            .string()
            .min(4, "Логін має містити не менше 4 символів")
            .matches(
                /^[a-zA-Z0-9._-]+$/,
                "Логін може містити лише латинські літери, цифри, крапку, дефіс або нижнє підкреслення"
            )
            .required("Дане поле обов'язкове до заповнення"),

        agencyEdrpou: yup
            .string()
            .notRequired()
            .test(
                "is-valid-edrpou",
                "ЄДРПОУ має містити від 8 до 10 цифр",
                (value) => {
                    if (!value) return true;
                    return edrpouRegex.test(value);
                }
            ),

        agencyCity: yup.string().notRequired(),
        agencyLegalAddress: yup.string().notRequired(),

        agencyEmail: yup
            .string()
            .matches(emailRegex, "Введіть валідний email")
            .required("Дане поле обов'язкове до заповнення"),

        agencyPhone: yup
            .string()
            .matches(phoneRegex, "Вкажіть правильний номер телефону")
            .required("Дане поле обов'язкове до заповнення"),

        mainOfficeEmail: yup
            .string()
            .matches(emailRegex, "Введіть валідний email")
            .required("Дане поле обов'язкове до заповнення"),
    });
