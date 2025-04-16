"use client";

import { useState } from "react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import NotificationPopUp from "@/components/shared/pop-ups/NotificationPopUp";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import ChangePasswordForm from "@/components/shared/forms/ChangePassword";

interface CallBackProps {
  className?: string;
}

export default function ChangePasswordFormWithNotifications({
  className,
}: CallBackProps) {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <>
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="w-full max-w-[550px]"
      >
        <ChangePasswordForm
          setIsError={setIsError}
          setIsNotificationShown={setIsNotificationShown}
          className={className}
        />
      </AnimatedWrapper>
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : "Успішно!"}
        description={
          isError
            ? "Спробуйте відправити форму ще раз або зателефонуйте нам."
            : "Ваш пароль оновлений."
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
