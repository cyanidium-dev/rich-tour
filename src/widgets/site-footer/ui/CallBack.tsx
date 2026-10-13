"use client";

import { useState } from "react";
import CallBackForm from "@/components/shared/forms/CallBackForm";
import NotificationPopUp from "@/components/shared/pop-ups/NotificationPopUp";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import styles from "./CallBack.module.css";

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
        className={`${styles.form} ${className ?? ""}`}
        fieldsClassName="flex flex-col w-full gap-y-2 mb-[18px]"
      />
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : "Дякуємо за повідомлення!"}
        description={
          isError
            ? "Спробуйте відправити форму ще раз або зателефонуйте нам."
            : "Наш менеджер скоро зв'яжеться з вами."
        }
        isPopUpShown={isNotificationShown}
        setIsPopUpShown={setIsNotificationShown}
      />
      <Backdrop isVisible={isNotificationShown} onClick={() => setIsNotificationShown(false)} />
    </>
  );
}
