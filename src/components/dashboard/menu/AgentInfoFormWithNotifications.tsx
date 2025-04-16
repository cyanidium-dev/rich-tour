"use client";

import { useState } from "react";
import NotificationPopUp from "@/components/shared/pop-ups/NotificationPopUp";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import AgentInfoForm from "@/components/shared/forms/AgentInfoForm";

interface CallBackProps {
  className?: string;
}

export default function AgentInfoFormWithNotifications({
  className,
}: CallBackProps) {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <>
      <AgentInfoForm
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
        className={className}
      />
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : "Дякуємо за оновлення!"}
        description={
          isError
            ? "Спробуйте відправити форму ще раз або зателефонуйте нам."
            : "Інформація оновлена успішно."
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
