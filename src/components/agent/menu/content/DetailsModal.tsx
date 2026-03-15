import { Dispatch, ReactNode, SetStateAction } from "react";
import IconButton from "../../../shared/buttons/IconButton";
import CrossInCircleIcon from "../../../shared/icons/CrossInCircleIcon";
import CloseHotelModalIcon from "@/components/tour/hotels/CloseHotelModalIcon";


interface ModalProps {
    isPopUpShown: boolean;
    setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
    className?: string;
}

export default function DetailsModal({
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
            } border border-[#E43A3A] fixed left-1/2 bottom-0 transform -translate-x-1/2 transition duration-[600ms] ease-out z-[60] w-[87.8%] max-w-[740px] max-h-[calc(100dvh-80px)] 
         xl:max-h-[calc(100dvh-80px)] bg-white rounded-[16px] py-[25px] xl:py-[40px] px-[25px] xl:px-[40px] ${className}`}
        >
            <div className="relative flex justify-between items-center w-full  rounded-[16px]">
                <h3 className="text-24semi xl:text-32semi text-[#18181B]">
                    Інформація про туристів
                </h3>
                    <button>
                        {<CloseHotelModalIcon onClick={()=> setIsPopUpShown(true)} className="size-full" />}
                    </button>


            </div>
            <div
                className="max-h-[calc(100dvh-80px-62px)] xl:max-h-[calc(100dvh-80px-84px)] px-6 lg:px-9 pt-[33px] lg:pt-7 pb-5 lg:pb-8 overflow-y-auto scrollbar scrollbar-w-[3px] scrollbar-thumb-rounded-full
         scrollbar-track-rounded-full scrollbar-thumb-main scrollbar-track-transparent popup-scroll"
            >
                {children}
            </div>
        </div>
    );
}
