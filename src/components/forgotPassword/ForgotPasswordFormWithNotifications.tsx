"use client";
import { useState } from "react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import NotificationPopUp from "../shared/pop-ups/NotificationPopUp";
import Backdrop from "../shared/backdrop/Backdrop";
import ForgotPasswordForm from "../shared/forms/ForgotPasswordForm";

export default function ForgotPasswordFormWithNotifications() {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <AnimatedWrapper
      animation={fadeInAnimation({ y: 30, delay: 0.8 })}
      className="max-w-[385px] sm:max-w-[280px] mx-auto"
    >
      <ForgotPasswordForm
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
      />
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : "Успішно!"}
        description={
          isError
            ? "Даний email незареєстрований в системі"
            : "На вашу електронну адресу відправлений лист."
        }
        isPopUpShown={isNotificationShown}
        setIsPopUpShown={setIsNotificationShown}
      />
      <Backdrop
        isVisible={isNotificationShown}
        onClick={() => setIsNotificationShown(false)}
      />
    </AnimatedWrapper>
  );
}
