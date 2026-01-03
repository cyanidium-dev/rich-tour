"use client";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { Form, Formik, FormikHelpers } from "formik";
import { loginValidation } from "@/schemas/loginFormValidation";
import CustomizedInput from "./formComponents/CustomizedInput";
import SubmitButton from "./formComponents/SubmitButton";

export interface ValuesLoginFormType {
    email: string;
    password: string;
}

interface LoginFormProps {
    setIsError: Dispatch<SetStateAction<boolean>>;
    setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
    setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
    className?: string;
    variant?: "red" | "black";
}

type LoginApiSuccess = {
    role: "agent" | "agency";
};

export default function LoginForm({
                                      setIsError,
                                      setIsNotificationShown,
                                      setIsPopUpShown,
                                      className = "",
                                      variant = "red",
                                  }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const initialValues: ValuesLoginFormType = {
        email: "",
        password: "",
    };

    const submitForm = async (
        values: ValuesLoginFormType,
        { resetForm }: FormikHelpers<ValuesLoginFormType>
    ) => {
        try {
            setIsError(false);
            setIsNotificationShown(false);
            setIsLoading(true);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                throw new Error("LOGIN_FAILED");
            }

            const data: LoginApiSuccess = await res.json();

            resetForm();
            setIsPopUpShown?.(false);

            if (data.role === "agent") {
                window.location.href = "/agent";
                return;
            }

            if (data.role === "agency") {
                window.location.href = "/agency";
                return;
            }

            throw new Error("UNKNOWN_ROLE");
        } catch (error) {
            console.error(error);
            setIsError(true);
            setIsNotificationShown(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submitForm}
            validationSchema={loginValidation()}
        >
            {({ errors, touched, dirty, isValid }) => (
                <Form className={className}>
                    <div className="flex flex-col w-full gap-y-5 mb-[18px]">
                        <CustomizedInput
                            fieldName="email"
                            inputType="text"
                            placeholder="Вкажіть email або login"
                            errors={errors}
                            touched={touched}
                        />
                        <CustomizedInput
                            fieldName="password"
                            inputType="password"
                            placeholder="Ваш пароль"
                            errors={errors}
                            touched={touched}
                        />
                    </div>

                    <p className="mb-4 text-12reg text-center">
                        Забули пароль?{" "}
                        <Link href="/auth/forgot-password" className="hover:text-main">
                            Відновити
                        </Link>
                    </p>

                    <SubmitButton
                        dirty={dirty}
                        isValid={isValid}
                        isLoading={isLoading}
                        text="Авторизуватися"
                        variant={variant}
                    />

                    <div className="mt-4 pt-4 border-t border-black">
                        <Link
                            href="/auth/sign-up"
                            className="block text-12reg text-center hover:text-main"
                        >
                            Створити новий доступ
                        </Link>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
