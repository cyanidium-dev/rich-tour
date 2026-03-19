import { Order } from "@/types/order";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import OrderItem from "./OrderItem";

interface CategoryProps {
    category: { orders: Order[] };
    showTourDetails: (id: string) => void;
}

export default function Category({ showTourDetails, category }: CategoryProps) {
    const { orders } = category;

    return (
        <AnimatedWrapper
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            className="relative"
        >
            <div className="w-full overflow-x-auto scrollbar scrollbar-h-[2.5px]">
                <table className="w-[1120px] border-collapse">
                    {/* column sizes */}
                    <colgroup>
                        <col className="w-[40px]" />
                        <col />
                        <col />
                        <col className="w-[70px]" />
                        <col />
                        <col />
                        <col className="w-[50px]" />
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
                        <th className="px-2 py-[18px] text-left font-normal">Номер замовлення</th>
                        <th className="px-2 py-[18px] text-left font-normal">
                            Назва <br /> туру
                        </th>
                        <th className="px-2 py-[18px] text-left font-normal">
                            Кількість <br /> днів
                        </th>
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

                    {/* BODY */}
                    <tbody>
                    {orders.map(order => (
                        <OrderItem showTourDetails={showTourDetails} key={order.id} order={order} />
                    ))}
                    </tbody>
                </table>
            </div>
        </AnimatedWrapper>
    );
}
