"use client";
import { useState } from "react";
import LoginForm from "../shared/forms/LoginForm";
import NotificationPopUp from "../shared/pop-ups/NotificationPopUp";
import Backdrop from "../shared/backdrop/Backdrop";

export default function LoginFormWithNotifications() {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <div className="max-w-[385px] sm:max-w-[280px] mx-auto">
      <LoginForm
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
      />
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : ""}
        description={isError ? "Невірний email або пароль." : ""}
        isPopUpShown={isNotificationShown}
        setIsPopUpShown={setIsNotificationShown}
      />
      <Backdrop
        isVisible={isNotificationShown}
        onClick={() => setIsNotificationShown(false)}
      />
    </div>
  );
}
