import { Dispatch, ReactNode, SetStateAction } from "react";
// import IconButton from "../../../shared/buttons/IconButton";
// import CrossInCircleIcon from "../../../shared/icons/CrossInCircleIcon";
import CloseHotelModalIcon from "@/components/tour/hotels/CloseHotelModalIcon";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import OrderItem from "@/components/agent/menu/content/OrderItem";

interface DetailsItem {
    index: number,
    pib: string,
    birthday: string,
    phone: string,
    passport: string,
    passportFinish: string,
    city: string,
}

interface ModalProps {
    isPopUpShown: boolean;
    setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
    className?: string;
    comment: string | undefined;
    details: DetailsItem[]
}

export default function DetailsModal({
                                             isPopUpShown,
                                             setIsPopUpShown,
                                             className = "",
    comment,
                                         details,
                                         }: ModalProps) {
    return (
        <div
            className={`${
                isPopUpShown
                    ? " -translate-y-[calc(50dvh-50%)] opacity-100 scale-100"
                    : "pointer-events-none opacity-0 scale-90"
            } border border-[#E43A3A] fixed left-1/2 bottom-0 transform -translate-x-1/2 transition duration-[600ms] ease-out z-[60] w-[87.8%] max-w-[1100px] max-h-[calc(100dvh-80px)] 
         xl:max-h-[calc(100dvh-80px)] bg-white rounded-[16px] py-[25px] xl:py-[40px] px-[25px] xl:px-[40px] ${className}`}
        >
            <div className="relative flex justify-between items-center w-full  rounded-[16px]">
                <h3 className="text-24semi xl:text-32semi text-[#18181B]">
                    Інформація про туристів
                </h3>
                    <button>
                        {<CloseHotelModalIcon onClick={()=> setIsPopUpShown(false)} className="size-full" />}
                    </button>
            </div>
            <div
                className="max-h-[calc(100dvh-80px-62px)] xl:max-h-[calc(100dvh-80px-84px)] pt-[36px] lg:pt-7 pb-5 lg:pb-8 overflow-y-auto scrollbar scrollbar-w-[3px] scrollbar-thumb-rounded-full
         scrollbar-track-rounded-full scrollbar-thumb-main scrollbar-track-transparent popup-scroll"
            >
                {comment && (
                    <>
                        <p className="text-16med xl:text-20med text-[#18181B]">Коментар</p>
                        <p>{comment}</p>
                    </>
                )}
                <AnimatedWrapper
                    animation={fadeInAnimation({ y: 30, delay: 0.4 })}
                    className="relative"
                >
                    <div className="w-full overflow-x-auto scrollbar scrollbar-h-[2.5px] mt-[40px]">
                        <table className="w-full border-collapse">
                            {/* column sizes */}
                            <colgroup>
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                            </colgroup>

                            {/* HEADER */}
                            <thead>
                            <tr className="bg-main text-white uppercase text-[12px] font-normal">
                                <th className="px-2 rounded-tl-[8px] rounded-bl-[8px] py-[18px] text-left font-normal">П/П</th>
                                <th className="px-2 py-[18px] text-left font-normal">ПІБ</th>
                                <th className="px-2 py-[18px] text-left font-normal">
                                    Дата народження
                                </th>
                                <th className="px-2 py-[18px] text-left font-normal">
                                    Номер телефону
                                </th>
                                <th className="px-2 py-[18px] text-left font-normal">
                                    Серія і номер <br/> паспорту
                                </th>
                                <th className="px-2 py-[18px] text-left font-normal">
                                    Дійсний до
                                </th>
                                <th className="px-2 py-[18px] text-left font-normal rounded-tr-[8px] rounded-br-[8px]">Виїзд
                                    з
                                </th>
                            </tr>
                            </thead>

                            {/* BODY */}
                            <tbody>
                            {details?.map(item => (
                                <tr key={item.index}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-14semi cursor-pointer">
                                    <td className="px-2 py-[20px]">{item.index}</td>
                                    <td className="px-2 py-[20px]">{item.pib}</td>
                                    <td className="px-2 py-[20px]">{item.birthday}</td>
                                    <td className="px-2 py-[20px]">{item.phone}</td>
                                    <td className="px-2 py-[20px]">{item.passport}</td>
                                    <td className="px-2 py-[20px]">{item.passportFinish}</td>
                                    <td className="px-2 py-[20px]">{item.city}</td>
                                </tr>
                            ))}
                            {/*{orders.map(order => (*/}
                            {/*    <OrderItem showTourDetails={showTourDetails} key={order.id} order={order} />*/}
                            {/*))}*/}
                            </tbody>
                        </table>
                    </div>
                </AnimatedWrapper>
            </div>
        </div>
    );
}
