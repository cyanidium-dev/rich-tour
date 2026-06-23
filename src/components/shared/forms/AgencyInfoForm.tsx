"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import MaskedInput from "react-text-mask";

import { agencyInfoValidation } from "@/schemas/agencyInfoFormValidation";
import { phoneMask } from "@/regex/regex";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesAgencyInfoFormType {
    legalAgencyName: string;
    marketingAgencyName?: string;
    login: string;
    agencyEdrpou?: string;
    agencyCity?: string;
    agencyLegalAddress?: string;
    agencyEmail: string;
    agencyPhone: string;
    mainOfficeEmail: string;
}

interface AgencyInfoFormProps {
    initialValues: ValuesAgencyInfoFormType;
    setIsError: Dispatch<SetStateAction<boolean>>;
    setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
    className?: string;
    variant?: "red" | "black";
}

const normalizeMaskedValue = (value?: string) =>
    value?.replace(/_/g, "").trim() ?? "";

export default function AgencyInfoForm({
                                           initialValues,
                                           setIsError,
                                           setIsNotificationShown,
                                           className = "",
                                           variant = "red",
                                       }: AgencyInfoFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const submitForm = async (
        values: ValuesAgencyInfoFormType,
        { resetForm }: FormikHelpers<ValuesAgencyInfoFormType>
    ) => {
        try {
            setIsLoading(true);
            setIsError(false);
            setIsNotificationShown(false);

            const payload = {
                ...values,
                agencyEdrpou: normalizeMaskedValue(values.agencyEdrpou),
                agencyPhone: normalizeMaskedValue(values.agencyPhone),
            };

            await axios.patch("/api/agency/profile", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            resetForm({ values });
            setIsNotificationShown(true);
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
            validationSchema={agencyInfoValidation()}
            onSubmit={submitForm}
            enableReinitialize
        >
            {({ errors, touched }) => (
                <Form
                    className={`${className} flex flex-col md:flex-row xl:flex-col gap-y-[18px] gap-x-5`}
                >
                    <div className="flex flex-col gap-[18px] md:w-[calc(50%-10px)] xl:w-full">
                        <CustomizedInput
                            fieldName="legalAgencyName"
                            placeholder="Офіційна назва агенції"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="marketingAgencyName"
                            placeholder="Маркетингова назва агенції"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="login"
                            placeholder="Логін"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="agencyEdrpou"
                            placeholder="ЄДРПОУ агенції"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="agencyCity"
                            placeholder="Місто реєстрації"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="agencyLegalAddress"
                            placeholder="Адреса реєстрації"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="agencyEmail"
                            inputType="email"
                            placeholder="Пошта агенції"
                            errors={errors}
                            touched={touched}
                        />

                        <CustomizedInput
                            fieldName="agencyPhone"
                            inputType="tel"
                            placeholder="Телефон агенції"
                            errors={errors}
                            touched={touched}
                            as={MaskedInput}
                            mask={phoneMask}
                        />

                        <CustomizedInput
                            fieldName="mainOfficeEmail"
                            inputType="email"
                            placeholder="Email головного офісу"
                            errors={errors}
                            touched={touched}
                        />

                        <SubmitButton
                            isLoading={isLoading}
                            text="Оновити"
                            variant={variant}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
}
