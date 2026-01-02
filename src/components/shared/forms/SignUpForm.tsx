"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import MaskedInput from "react-text-mask";

import { signUpValidation } from "@/schemas/signUpFormValidation";
import { phoneMask, edrpouMask } from "@/regex/regex";

import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesSignUpFormType {
    email: string;
    companyName: string;
    phone: string;
    license?: string;
    city: string;
    password: string;
    site?: string;
    legalCompanyName?: string;
    country: string;
}

interface SignUpFormProps {
    setIsError: Dispatch<SetStateAction<boolean>>;
    setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
    setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
    className?: string;
    variant?: "red" | "black";
}

export default function SignUpForm({
                                       setIsError,
                                       setIsNotificationShown,
                                       setIsPopUpShown,
                                       className = "",
                                       variant = "red",
                                   }: SignUpFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const initialValues: ValuesSignUpFormType = {
        email: "",
        companyName: "",
        phone: "",
        license: "",
        city: "",
        password: "",
        site: "",
        legalCompanyName: "",
        country: "",
    };

    const submitForm = async (
        values: ValuesSignUpFormType,
        { resetForm }: FormikHelpers<ValuesSignUpFormType>
    ) => {
        try {
            setIsError(false);
            setIsNotificationShown(false);
            setIsLoading(true);

            await axios.post("/api/auth/sign-up", values, {
                headers: { "Content-Type": "application/json" },
            });

            resetForm();
            setIsNotificationShown(true);

            setTimeout(() => {
                setIsPopUpShown?.(false);
                router.push("/auth/sign-in");
            }, 1500);
        } catch {
            setIsError(true);
            setIsNotificationShown(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={signUpValidation()}
            onSubmit={submitForm}
        >
            {({ errors, touched, dirty, isValid }) => (
                <Form className={className}>
                    <div
                        className="
              grid grid-cols-1
              md:grid-cols-2
              gap-y-5 gap-x-5
              xl:gap-x-[45px]
              mb-6
            "
                    >
                        {/* Левая колонка */}
                        <CustomizedInput
                            fieldName="email"
                            inputType="email"
                            placeholder="Email*"
                            errors={errors}
                            touched={touched}
                        />

                        {/* Правая колонка */}
                        <CustomizedInput
                            fieldName="password"
                            inputType="password"
                            placeholder="Пароль*"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="companyName"
                            placeholder="Повне імʼя назви фірми*"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="site"
                            placeholder="Сайт*"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="phone"
                            inputType="tel"
                            as={MaskedInput}
                            mask={phoneMask}
                            placeholder="Телефон*"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="legalCompanyName"
                            placeholder="Юридична назва фірми"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="license"
                            placeholder="Номер ліцензії"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="country"
                            placeholder="Країна*"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="city"
                            placeholder="Місто*"
                            errors={errors}
                            touched={touched}
                        />

                        {/* Кнопка — строго справа снизу */}
                        <div className="md:col-start-2 flex flex-col gap-3">
                            <SubmitButton
                                dirty={dirty}
                                isValid={isValid}
                                isLoading={isLoading}
                                text="Зареєструватися"
                                variant={variant}
                                className="w-full"
                            />

                            <p className="text-12reg text-center text-white/70">
                                Уже маєте аккаунт?{" "}
                                <Link
                                    href="/auth/sign-in"
                                    className="underline hover:text-main transition"
                                >
                                    Вхід в кабінет агента
                                </Link>
                            </p>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
