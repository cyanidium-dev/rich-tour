"use client";

import { useState } from "react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import CallBackForm from "../shared/forms/CallBackForm";
import NotificationPopUp from "../shared/pop-ups/NotificationPopUp";
import Backdrop from "../shared/backdrop/Backdrop";
import styles from "./ReviewForm.module.css";
import { reviewValidation } from "@/schemas/reviewValidation";
import type { ValuesCallBackFormType } from "@/schemas/callBackFormValidation";

interface ReviewFormProps {
  className?: string;
}

export default function ReviewForm({ className }: ReviewFormProps) {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  const submitReview = async (values: ValuesCallBackFormType) => {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) throw new Error("Failed to submit review");
  };

  return (
    <>
      <AnimatedWrapper
        animation={fadeInAnimation({ x: 30, delay: 0.4 })}
        className="md:min-w-[23.67%]"
      >
        <h3 className="mb-7 text-24med xl:text-28med">Залиште відгук</h3>
        <CallBackForm
          onSubmit={submitReview}
          validationSchema={reviewValidation}
          setIsError={setIsError}
          setIsNotificationShown={setIsNotificationShown}
          className={`${styles.form} ${className ?? ""}`}
          variant="black"
        />
      </AnimatedWrapper>
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
      <Backdrop isVisible={isNotificationShown} onClick={() => setIsNotificationShown(false)} />
    </>
  );
}
