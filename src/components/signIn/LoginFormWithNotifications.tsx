"use client";
import { useState } from "react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import LoginForm from "../shared/forms/LoginForm";
import NotificationPopUp from "../shared/pop-ups/NotificationPopUp";
import Backdrop from "../shared/backdrop/Backdrop";

export default function LoginFormWithNotifications() {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  return (
    <>
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30, delay: 0.4 })}
        className="max-w-[385px] sm:max-w-[280px] mx-auto"
      >
        <LoginForm
          setIsError={setIsError}
          setIsNotificationShown={setIsNotificationShown}
          setErrorMessage={setErrorMessage}
        />
      </AnimatedWrapper>
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : ""}
        description={errorMessage || "Невірний email або пароль."}
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
