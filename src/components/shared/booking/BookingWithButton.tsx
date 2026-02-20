"use client";
import { useState, useEffect } from "react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import MainButton from "@/components/shared/buttons/MainButton";
import Booking from "./Booking";
import { Tour } from "@/types/tour";

interface BookingWithButtonProps {
  buttonStyles?: string;
  tour: Tour;
    forceOpen?: boolean;
    onForceOpenHandled?: () => void;
    initialDate?: string | null;
}

export default function BookingWithButton({
  tour,
  buttonStyles = "",
                                              forceOpen,
                                              onForceOpenHandled,
                                              initialDate,
}: BookingWithButtonProps) {
  const [isPopUpShown, setIsPopUpShown] = useState(false);
    useEffect(() => {
        if (forceOpen) {
            setIsPopUpShown(true);
            onForceOpenHandled?.();
        }
    }, [forceOpen, onForceOpenHandled]);
  return (
    <>
      <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.4 })}>
        <MainButton
          onClick={() => setIsPopUpShown(true)}
          className={buttonStyles}
        >
          Забронювати
        </MainButton>
      </AnimatedWrapper>
      <Booking
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
        tour={tour}
        initialDate={initialDate}
      />
    </>
  );
}
