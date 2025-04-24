"use client";
import { Dispatch, useState, SetStateAction } from "react";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import BookingForm from "@/components/shared/forms/BookingForm";
import BookingFormModal from "@/components/shared/modals/BookingFormModal";
import NotificationPopUp from "@/components/shared/pop-ups/NotificationPopUp";
import BookingAgentForm from "../forms/BookingAgentForm";
import { Tour } from "@/types/tour";

interface BookingProps {
  tour: Tour;
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function Booking({
  tour,
  isPopUpShown,
  setIsPopUpShown,
}: BookingProps) {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);
  const isAuthenticated = true;

  const { title, tourDepartures } = tour;

  return (
    <>
      <BookingFormModal
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
      >
        <div className="flex gap-x-[18px] items-center mb-5">
          <p className="text-14reg xl:text-16reg">Назва туру:</p>
          <h4 className="w-[calc(100%-82px-18px)] xl:w-[calc(100%-94px-18px)] text-14semi xl:text-16semi">
            {title}
          </h4>
        </div>
        {isAuthenticated ? (
          <BookingAgentForm
            setIsError={setIsError}
            setIsNotificationShown={setIsNotificationShown}
            setIsPopUpShown={setIsPopUpShown}
            tourDepartures={tourDepartures}
          />
        ) : (
          <BookingForm
            setIsError={setIsError}
            setIsNotificationShown={setIsNotificationShown}
            setIsPopUpShown={setIsPopUpShown}
            tourDepartures={tourDepartures}
          />
        )}
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
