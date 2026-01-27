import { Order } from "@/types/order";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import OrderItem from "./OrderItem";

interface CategoryProps {
    category: { orders: Order[] };
}

export default function Category({ category }: CategoryProps) {
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
                        <col className="w-[35px]" />
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
                    <tr className="bg-main text-white uppercase text-14semi xl:text-12semi">
                        <th className="px-2 py-[20px] text-left">П/П</th>
                        <th className="px-2 py-[20px] text-left">Номер замовлення</th>
                        <th className="px-2 py-[20px] text-left">
                            Назва <br /> туру
                        </th>
                        <th className="px-2 py-[20px] text-left">
                            Кількість <br /> днів
                        </th>
                        <th className="px-2 py-[20px] text-left">
                            Дані <br /> туристів
                        </th>
                        <th className="px-2 py-[20px] text-left">Вартість заявки</th>
                        <th className="px-2 py-[20px] text-left">Комісія</th>
                        <th className="px-2 py-[20px] text-left">Внесено коштів</th>
                        <th className="px-2 py-[20px] text-left">Залишок до сплати</th>
                        <th className="px-2 py-[20px] text-left">
                            Дата початку і завершення
                        </th>
                        <th className="px-2 py-[20px] text-left">Статус заявки</th>
                        <th className="px-2 py-[20px] text-left">Коментар</th>
                    </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                    {orders.map(order => (
                        <OrderItem key={order.id} order={order} />
                    ))}
                    </tbody>
                </table>
            </div>
        </AnimatedWrapper>
    );
}
