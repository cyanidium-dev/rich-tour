"use client";

import { useState } from "react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import CallBackForm from "../shared/forms/CallBackForm";
import NotificationPopUp from "../shared/pop-ups/NotificationPopUp";
import Backdrop from "../shared/backdrop/Backdrop";

interface ReviewFormProps {
  className?: string;
}

export default function ReviewForm({ className }: ReviewFormProps) {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <AnimatedWrapper
      animation={fadeInAnimation({ x: 30, delay: 0.4 })}
      className="md:min-w-[23.67%]"
    >
      <h3 className="mb-7 text-24med xl:text-28med">Залиште відгук</h3>
      <CallBackForm
        setIsError={setIsError}
        setIsNotificationShown={setIsNotificationShown}
        className={className}
        variant="black"
      />
      <NotificationPopUp
        title={isError ? "На жаль, щось пішло не так" : "Дякуємо за відгук!"}
        description={
          isError
            ? "Спробуйте відправити відгук ще раз або зателефонуйте нам."
            : "Ваша думка дуже важлива для нас і допомагає ставати ще краще."
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
