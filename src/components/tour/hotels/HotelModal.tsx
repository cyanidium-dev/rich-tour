import { Dispatch, ReactNode, SetStateAction } from "react";
import CloseHotelModalIcon from "@/components/tour/hotels/CloseHotelModalIcon";

interface ModalProps {
    isPopUpShown: boolean;
    setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
    className?: string;
}

export default function HotelModal({
                                       isPopUpShown,
                                       setIsPopUpShown,
                                       children,
                                       className = "",
                                   }: ModalProps) {
    return (
        <div
            className={`${
                isPopUpShown
                    ? " -translate-y-[calc(50dvh-50%)] opacity-100 scale-100"
                    : "pointer-events-none opacity-0 scale-90"
            } fixed left-1/2 bottom-0 transform -translate-x-1/2
      transition duration-[600ms] ease-out z-[60]
      w-[95%] max-w-[1000px]
      max-h-[calc(100dvh-80px)]
      ${className}`}
        >
            {/* визуальная карточка */}
            <div className="relative bg-white rounded-[16px] overflow-hidden max-h-[calc(100dvh-80px)]">
                <CloseHotelModalIcon
                    onClick={() => setIsPopUpShown(false)}
                    className="absolute top-[15px] xl:top-[23px] right-[9px] xl:right-[23px]
          cursor-pointer opacity-70 hover:opacity-100 transition z-20"
                />

                {/* контент: без вертикальных паддингов, чтобы не было воздуха сверху/снизу */}
                <div className="px-6 lg:px-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
