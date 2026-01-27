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
    legalCompanyName: string;
    phone: string;
    edrpou: string;
    city: string;
    taxForm: "fop" | "tov" | "other";
    password: string;
    site?: string;
}

interface SignUpFormProps {
    setIsError: Dispatch<SetStateAction<boolean>>;
    setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
    setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
    className?: string;
    variant?: "red" | "black";
}

const normalizeMaskedValue = (value: string) =>
    value.replace(/_/g, "").trim();

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
        legalCompanyName: "",
        phone: "",
        edrpou: "",
        city: "",
        taxForm: "fop",
        password: "",
        site: "",
    };

    const submitForm = async (
        values: ValuesSignUpFormType,
        { resetForm }: FormikHelpers<ValuesSignUpFormType>
    ) => {
        try {
            setIsError(false);
            setIsNotificationShown(false);
            setIsLoading(true);

            const payload: ValuesSignUpFormType = {
                ...values,
                edrpou: normalizeMaskedValue(values.edrpou),
                phone: normalizeMaskedValue(values.phone),
            };

            await axios.post("/api/auth/sign-up", payload, {
                headers: { "Content-Type": "application/json" },
            });

            resetForm();
            setIsNotificationShown(true);

            setTimeout(() => {
                setIsPopUpShown?.(false);
                router.push("/auth/sign-in");
            }, 1500);
        } catch(error) {
            console.log(error);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5 xl:gap-x-[45px] mb-6">
                        <CustomizedInput fieldName="email" inputType="email" placeholder="Email*" errors={errors} touched={touched} />
                        <CustomizedInput fieldName="password" inputType="password" placeholder="Пароль*" errors={errors} touched={touched} />

                        <CustomizedInput fieldName="companyName" placeholder="Повна назва компанії*" errors={errors} touched={touched} />
                        <CustomizedInput fieldName="legalCompanyName" placeholder="Юридична назва компанії*" errors={errors} touched={touched} />

                        <CustomizedInput fieldName="phone" inputType="tel" as={MaskedInput} mask={phoneMask} placeholder="Телефон*" errors={errors} touched={touched} />
                        <CustomizedInput fieldName="edrpou" as={MaskedInput} mask={edrpouMask} placeholder="ЄДРПОУ*" errors={errors} touched={touched}  />

                        <CustomizedInput fieldName="city" placeholder="Місто*" errors={errors} touched={touched} />
                        <CustomizedInput fieldName="site" placeholder="Сайт" errors={errors} touched={touched} />

                        <CustomizedInput fieldName="taxForm" as="select" errors={errors} touched={touched}>
                            <option value="fop">ФОП</option>
                            <option value="tov">ТОВ</option>
                            <option value="other">Інше</option>
                        </CustomizedInput>

                        <div className="md:col-start-2 flex flex-col gap-3">
                            <SubmitButton
                                dirty={dirty}
                                isValid={isValid}
                                isLoading={isLoading}
                                text="Зареєструватися"
                                variant={variant}
                                className="w-full"
                            />

                            <p className="text-12reg text-center">
                                Уже маєте аккаунт?{" "}
                                <Link href="/auth/sign-in" className="underline hover:text-main">
                                    Вхід
                                </Link>
                            </p>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
