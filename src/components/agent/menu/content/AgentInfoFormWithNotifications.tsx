"use client";

import { useState } from "react";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import NotificationPopUp from "@/components/shared/pop-ups/NotificationPopUp";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import AgentInfoForm, {
    ValuesAgentInfoFormType,
} from "@/components/shared/forms/AgentInfoForm";

interface Props {
    initialData: ValuesAgentInfoFormType;
    className?: string;
}

export default function AgentInfoFormWithNotifications({
                                                           initialData,
                                                           className,
                                                       }: Props) {
    const [isError, setIsError] = useState(false);
    const [isNotificationShown, setIsNotificationShown] = useState(false);

    return (
        <>
            <AnimatedWrapper className="w-full xl:w-[49.1%]">
                <AgentInfoForm
                    initialValues={initialData}
                    setIsError={setIsError}
                    setIsNotificationShown={setIsNotificationShown}
                    className={className}
                />
            </AnimatedWrapper>

            <NotificationPopUp
                title={isError ? "На жаль, щось пішло не так" : "Дякуємо за оновлення!"}
                description={
                    isError
                        ? "Спробуйте відправити форму ще раз."
                        : "Інформація успішно змінена."
                }
                isPopUpShown={isNotificationShown}
                setIsPopUpShown={setIsNotificationShown}
            />

            <Backdrop
                isVisible={isNotificationShown}
                onClick={() => setIsNotificationShown(false)}
            />
        </>
    );
}
