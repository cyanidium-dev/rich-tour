import { Dispatch, SetStateAction } from "react";
import NotificationModal from "../modals/NotificationModal";
import Image from "next/image";

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
      <div className="pt-[78px] xl:pt-[55px] px-[38px] mb-[60px] xl:mb-[55px] mx-auto">
        <h3 className="max-w-[386px] mx-auto mb-6 text-24semi xl:text-40semi text-center">
          {title}
        </h3>
        <p className="max-w-[386px] mx-auto text-16reg xl:text-20reg text-center">
          {description}
        </p>
      </div>
      <Image
        src="/images/notifications/arrow.svg"
        alt="arrow"
        width="162"
        height="143"
        className="absolute top-[18px] md:top-[62px] left-[17px] md:left-auto md:right-[38px] w-[92px] md:w-[141px] h-auto scale-x-[-1] md:scale-x-[1]"
      />
      <div className="relative w-full h-[182px] overflow-hidden rounded-[16px]">
        <Image
          src="/images/notifications/sea.webp"
          alt="sea"
          sizes="90vw"
          fill
          className="w-full h-full object-cover object-left"
        />
      </div>
    </NotificationModal>
  );
}
