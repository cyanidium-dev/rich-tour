"use client";

import { useState } from "react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
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
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="w-full  xl:w-[49.1%]"
      >
        <AgentInfoForm
          setIsError={setIsError}
          setIsNotificationShown={setIsNotificationShown}
          className={className}
        />
      </AnimatedWrapper>
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : "Дякуємо за оновлення!"}
        description={
          isError
            ? "Спробуйте відправити форму ще раз або зателефонуйте нам."
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
