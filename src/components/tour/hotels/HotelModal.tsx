import { Dispatch, ReactNode, SetStateAction } from "react";
// import IconButton from "../buttons/IconButton";
// import CrossInCircleIcon from "../icons/CrossInCircleIcon";
import CloseHotelModalIcon from "@/components/tour/hotels/CloseHotelModalIcon";

interface ModalProps {
    isPopUpShown: boolean;
    setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
    className?: string;
}

export default function BookingFormModal({
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
            } fixed left-1/2 bottom-0 transform -translate-x-1/2 transition duration-[600ms] ease-out z-[60] w-[87.8%] max-w-[740px] max-h-[calc(100dvh-80px)] 
         xl:max-h-[calc(100dvh-80px)] bg-white rounded-[16px] ${className}`}
        >
            {/*@ts-expect-error*/}
            <CloseHotelModalIcon onClick={()=> setIsPopUpShown(false)} className=" absolute top-[15px] xl:top-[23px] right-[9px] xl:right-[23px]" />
            {/*<div className="relative w-full py-[21px] xl:py-[27px] px-6 bg-main rounded-[16px]">*/}
            {/*    <h3 className="text-16semi xl:text-24semi text-white md:text-center">*/}
            {/*        Форма бронювання туру*/}
            {/*    </h3>*/}
            {/*    /!*<IconButton*!/*/}
            {/*    /!*    handleClick={() => setIsPopUpShown(false)}*!/*/}
            {/*    /!*    className="absolute top-[15px] xl:top-[19px] right-[9px] xl:right-[21px] size-8 xl:size-[46px]"*!/*/}
            {/*    /!*>*!/*/}
            {/*    /!*    {<CloseHotelModalIcon className="size-full" />}*!/*/}
            {/*    /!*</IconButton>*!/*/}
            {/*</div>*/}
            <div
                className="max-h-[calc(100dvh-80px-62px)] xl:max-h-[calc(100dvh-80px-84px)] px-6 lg:px-9 pt-[33px] lg:pt-7 pb-5 lg:pb-8 overflow-y-auto scrollbar scrollbar-w-[3px] scrollbar-thumb-rounded-full
         scrollbar-track-rounded-full scrollbar-thumb-main scrollbar-track-transparent popup-scroll"
            >
                {children}
            </div>
        </div>
    );
}
