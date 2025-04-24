"use client";
import { useState } from "react";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import MainButton from "@/components/shared/buttons/MainButton";
import Booking from "./Booking";
import { Tour } from "@/types/tour";

interface BookingWithButtonProps {
  buttonStyles?: string;
  tour: Tour;
}

export default function BookingWithButton({
  tour,
  buttonStyles = "",
}: BookingWithButtonProps) {
  const [isPopUpShown, setIsPopUpShown] = useState(false);

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
      />
    </>
  );
}
