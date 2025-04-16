import { Order } from "@/types/order";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import OrderItem from "./OrderItem";

interface CategoryProps {
  category: { title: string; orders: Order[] };
}

export default function Category({ category }: CategoryProps) {
  const { title, orders } = category;
  return (
    <li>
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        as="h3"
        className="mb-6 xl:mb-10 text-20med xl:text-40med"
      >
        {title}
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30, delay: 0.4 })}
        className="relative"
      >
        <div className="absolute left-0 top-0 w-[1120px] h-full pointer-events-none z-10 shadow-category rounded-[12px]"></div>
        <div
          className="w-full scroll-px-4 overflow-x-auto scroll-x scrollbar scrollbar-h-[2.5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-transparent 
       scrollbar-track-transparent"
        >
          <div className="p-4 w-[1120px] rounded-[12px]">
            <div
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr_2fr] gap-x-4 py-3 bg-main rounded-[8px] text-white uppercase 
            text-14semi xl:text-16semi scroll-snap-item"
            >
              <p className="px-2 sticky left-0 bg-main z-10">Назва туру</p>
              <p>Кількість днів</p>
              <p>Вартість туру</p>
              <p>Комісія</p>
              <p>Коментар</p>
            </div>
            <div className="scroll-snap-item">
              {orders.map((order, idx) => (
                <OrderItem key={idx} order={order} />
              ))}
            </div>
          </div>
        </div>
      </AnimatedWrapper>
    </li>
  );
}
