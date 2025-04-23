"use client";
import { Dispatch, useState, SetStateAction } from "react";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import BookingForm from "@/components/shared/forms/BookingForm";
import BookingFormModal from "@/components/shared/modals/BookingFormModal";
import NotificationPopUp from "@/components/shared/pop-ups/NotificationPopUp";

interface BookingProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function Booking({
  isPopUpShown,
  setIsPopUpShown,
}: BookingProps) {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <>
      <BookingFormModal
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
      >
        <BookingForm
          setIsError={setIsError}
          setIsNotificationShown={setIsNotificationShown}
        />
      </BookingFormModal>
      <NotificationPopUp
        title={
          isError ? "На жаль, щось пішло не так" : "Дякуємо за бронювання!"
        }
        description={
          isError
            ? "Спробуйте відправити форму ще раз або зателефонуйте нам."
            : "Менеджер скоро зв’яжеться з вами і ми зможемо обговорити деталі"
        }
        isPopUpShown={isNotificationShown}
        setIsPopUpShown={setIsNotificationShown}
      />
      <Backdrop
        isVisible={isNotificationShown || isPopUpShown}
        onClick={() => {
          setIsNotificationShown(false);
          setIsPopUpShown(false);
        }}
      />
    </>
  );
}
