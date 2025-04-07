"use client";

import { useState } from "react";
import CallBackForm from "../forms/CallBackForm";
import NotificationPopUp from "../pop-ups/NotificationPopUp";
import Backdrop from "../backdrop/Backdrop";

interface CallBackProps {
  className?: string;
}

export default function CallBack({ className }: CallBackProps) {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <>
      <CallBackForm
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
        className={className}
      />
      <NotificationPopUp
        title={
          isError ? "На жаль, щось пішло не так" : "Дякуємо за повідомлення!"
        }
        description={
          isError
            ? "Спробуйте відправити форму ще раз або зателефонуйте нам."
            : "Наш менеджер скоро зв'яжеться з вами."
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
