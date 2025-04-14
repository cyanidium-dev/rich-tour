"use client";
import { useState } from "react";
import NotificationPopUp from "../shared/pop-ups/NotificationPopUp";
import Backdrop from "../shared/backdrop/Backdrop";
import ResetPasswordForm from "../shared/forms/ResetPasswordForm";

export default function ForgotPasswordFormWithNotifications() {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <div className="max-w-[385px] sm:max-w-[280px] mx-auto">
      <ResetPasswordForm
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
      />
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : "Успішно!"}
        description={
          isError ? "Спробуйте відправити ще раз" : "Ваш пароль змінено"
        }
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
