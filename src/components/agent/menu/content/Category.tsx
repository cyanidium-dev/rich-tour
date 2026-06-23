import type { OrderTableRow } from "./OrdersContent";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import OrderItem from "./OrderItem";

interface CategoryProps {
    category: { orders: OrderTableRow[] };
    showTourDetails: (id: string) => void;
    variant?: "agent" | "agency";
}

export default function Category({
                                     showTourDetails,
                                     category,
                                     variant = "agent",
                                 }: CategoryProps) {
    const { orders } = category;
    const isAgency = variant === "agency";

    return (
        <AnimatedWrapper
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            className="relative"
        >
            <div className="w-full overflow-x-auto scrollbar scrollbar-h-[2.5px]">
                <table className={`${isAgency ? "w-[1118px]" : "w-[1080px]"} table-fixed border-collapse`}>
                    <colgroup>
                        {isAgency && <col className="w-[105px]" />}
                        <col className={isAgency ? "w-[85px]" : "w-[96px]"} />
                        <col className={isAgency ? "w-[145px]" : "w-[150px]"} />
                        {!isAgency && <col className="w-[70px]" />}
                        <col className={isAgency ? "w-[155px]" : "w-[170px]"} />
                        <col className={isAgency ? "w-[80px]" : "w-[92px]"} />
                        <col className={isAgency ? "w-[65px]" : "w-[70px]"} />
                        <col className={isAgency ? "w-[85px]" : "w-[94px]"} />
                        <col className={isAgency ? "w-[95px]" : "w-[100px]"} />
                        <col className={isAgency ? "w-[115px]" : "w-[116px]"} />
                        <col className={isAgency ? "w-[95px]" : "w-[102px]"} />
                        <col className={isAgency ? "w-[93px]" : "w-[90px]"} />
                    </colgroup>

                    <thead>
                    <tr className="bg-main text-white uppercase text-[12px] font-normal">
                        {isAgency && (
                            <th className="px-2 rounded-tl-[8px] rounded-bl-[8px] py-[18px] text-left font-normal">Агент</th>
                        )}
                        <th className={`${isAgency ? "" : "rounded-tl-[8px] rounded-bl-[8px]"} px-2 py-[18px] text-left font-normal`}>
                            Номер замовлення
                        </th>
                        <th className="px-2 py-[18px] text-left font-normal">
                            Назва <br /> туру
                        </th>
                        {!isAgency && (
                            <th className="px-2 py-[18px] text-left font-normal">
                                Кількість <br /> днів
                            </th>
                        )}
                        <th className="px-2 py-[18px] text-left font-normal">
                            Дані <br /> туристів
                        </th>
                        <th className="px-2 py-[18px] text-left font-normal">Вартість заявки</th>
                        <th className="px-2 py-[18px] text-left font-normal">Комісія</th>
                        <th className="px-2 py-[18px] text-left font-normal">Внесено коштів</th>
                        <th className="px-2 py-[18px] text-left font-normal">Залишок до сплати</th>
                        <th className="px-2 py-[18px] text-left font-normal">
                            Дата початку і завершення
                        </th>
                        <th className="px-2 py-[18px] text-left font-normal">Статус заявки</th>
                        <th className="px-2 py-[18px] text-left rounded-tr-[8px] rounded-br-[8px] font-normal">Коментар</th>
                    </tr>
                    </thead>

                    <tbody>
                    {orders.map((order) => (
                        <OrderItem
                            showTourDetails={showTourDetails}
                            key={order.id}
                            order={order}
                            variant={variant}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </AnimatedWrapper>
    );
}
