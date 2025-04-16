import { Order } from "@/types/order";

export interface OrderItem {
  order: Order;
}

export default function OrderItem({ order }: OrderItem) {
  const { title, daysQuantity, tourCost, commission, comment } = order;

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_2fr] gap-x-4 text-14light">
      <p className="px-2 py-3 sticky left-0 bg-white z-10">{title}</p>
      <p className="px-2 py-3">{daysQuantity}</p>
      <p className="px-2 py-3">{tourCost}</p>
      <p className="px-2 py-3">{commission}</p>
      <p className="px-2 py-3">{comment}</p>
    </div>
  );
}
