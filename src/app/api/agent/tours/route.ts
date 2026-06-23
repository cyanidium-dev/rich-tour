import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import { getCrmOrdersByClientId } from "@/lib/crm/getCrmOrdersByClientId";

export async function GET() {
    const user = await getAuthUser();

    if (!user || user.role !== "agent") {
        return NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 }
        );
    }

    if (!user.crmId) {
        return NextResponse.json(
            { error: "CRM_ID_MISSING" },
            { status: 409 }
        );
    }

    try {
        const allOrders = await getCrmOrdersByClientId(user.crmId);

        return NextResponse.json({ orders: allOrders });
    } catch (error) {
        console.error("Failed to fetch agent orders from CRM:", error);

        return NextResponse.json(
            { error: "FAILED_TO_FETCH_ORDERS" },
            { status: 500 }
        );
    }
}
