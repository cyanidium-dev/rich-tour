"use client";
import { useState } from "react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import NotificationPopUp from "../shared/pop-ups/NotificationPopUp";
import Backdrop from "../shared/backdrop/Backdrop";
import SignUpForm from "../shared/forms/SignUpForm";

export default function SignUpFormWithNotifications() {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <AnimatedWrapper
      animation={fadeInAnimation({ y: 30, delay: 0.4 })}
      className="max-w-[489px] md:max-w-[569px] mx-auto"
    >
      <SignUpForm
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
      />
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : "Успішно!"}
        description={
          isError
            ? "Спробуйте відправити форму ще раз"
            : "Дякуємо за реєстрацію!"
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
