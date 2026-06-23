import type { OrderTableRow } from "./OrdersContent";

interface OrderItemProps {
    order: OrderTableRow;
    showTourDetails: (id: string) => void;
    variant?: "agent" | "agency";
}

export default function OrderItem({
                                      showTourDetails,
                                      order,
                                      variant = "agent",
                                  }: OrderItemProps) {
    const isAgency = variant === "agency";

    return (
        <tr
            onClick={() => showTourDetails(order.id)}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-14semi cursor-pointer"
        >
            {isAgency && (
                <td className="px-2 py-[20px]">{order.agentName || "—"}</td>
            )}
            <td className="px-2 py-[20px]">{order.orderNumber || order.id}</td>
            <td className="px-2 py-[20px]">{order.tourTitle || "—"}</td>
            {!isAgency && (
                <td className="px-2 py-[20px]">{order.daysQuantity || "—"}</td>
            )}
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

            <td className="px-2 py-[20px]">
                <span className={isAgency ? "line-clamp-2" : ""}>
                    {order.comment}
                </span>
            </td>
        </tr>
    );
}
