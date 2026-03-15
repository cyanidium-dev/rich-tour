import { Order } from "@/types/order";

interface OrderItemProps {
    order: Order;
    showTourDetails: (id: string) => void;
}

export default function OrderItem({ showTourDetails, order }: OrderItemProps) {

    return (
        <tr onClick={()=> showTourDetails(order.id)} className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-14semi cursor-pointer">
            <td className="px-2 py-[20px]">{order.index}</td>
            <td className="px-2 py-[20px]">{order.id}</td>
            <td className="px-2 py-[20px]">{order.tourTitle ? order.tourTitle : "—"}</td>
            <td className="px-2 py-[20px]">{order.daysQuantity ? order.daysQuantity : "—"}</td>
            <td className="px-2 py-[20px]">{order.tourists}</td>

            <td className="px-2 py-[20px]">{order.totalCost ? `${order.totalCost} €` : "—"}</td>
            <td className="px-2 py-[20px]">{order.commission ? `${order.commission} €` : "—"}</td>
            <td className="px-2 py-[20px]">{order.paidAmount ? `${order.paidAmount} €` : "—"}</td>
            <td className="px-2 py-[20px]">{order.remainingAmount ? `${order.remainingAmount} €` : "—"}</td>

            <td className="px-2 py-[20px]">
                {order.startDate ? `${order.startDate} – ${order.endDate}` : "—"}
            </td>

            <td className="px-2 py-[20px] capitalize">
                {order.status}
            </td>

            <td className="px-2 py-[20px]">{order.comment}</td>
        </tr>
    );
}
