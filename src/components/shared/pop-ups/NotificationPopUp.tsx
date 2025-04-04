import { Dispatch, SetStateAction } from "react";
import NotificationModal from "../modals/NotificationModal";

interface NotificationPopUpProps {
  title: string;
  description: string;
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function NotificationPopUp({
  title,
  description,
  isPopUpShown,
  setIsPopUpShown,
}: NotificationPopUpProps) {
  return (
    <NotificationModal
      isPopUpShown={isPopUpShown}
      setIsPopUpShown={setIsPopUpShown}
    >
      <div className="px-[38px]">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </NotificationModal>
  );
}
