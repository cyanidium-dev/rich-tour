import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import { getAgentOrdersFromCrm } from "@/lib/crm/getAgentOrdersFromCrm";

type CrmOrder = {
    id: string | number;
    [key: string]: unknown;
};

const LIMIT = 200;

export async function GET() {
    const user = await getAuthUser();

    if (!user || user.role !== "agent") {
        return NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 }
        );
    }

    const basePayload = {
        limit: LIMIT,
        filter: {
            // @ts-expect-error
            clientid: user.crmId,
        },
        fields: [
            "id",
            "clientname",
            "externalid",
            "statusid",
            "customfields.Nazvaturu",
            "customfields.zagalsumabezkomisi",
            "customfields.zagalnasumapokomisi",
            "customfields.Oplachenopozayavtsi",
            "customfields.Zalishilosoplatitipozayavtsi",
            "customfields.Dataturut",
            "customfields.Datazakinchennyaturu",
            "customfields.Dodatkovidani",
            "customfields.Oplachenopozayavtsi",
            "orderproducts",
        ],
        orderproductfields: [
            "name",
            "customfields.Datanarya",
            "customfields.Telefon",
            "customfields.Pasport",
            "customfields.Mistoposadki",
            "customfields.Datazavershpasp",
        ],
    };

    try {
        const allOrders: CrmOrder[] = [];
        const seenIds = new Set<string>();
        let lastId: number | undefined = undefined;

        while (true) {
            const payload = {
                ...basePayload,
                filter: {
                    ...basePayload.filter,
                    ...(lastId !== undefined ? { lastid: lastId } : {}),
                },
            };

            const chunk = await getAgentOrdersFromCrm(payload);

            if (!Array.isArray(chunk) || chunk.length === 0) {
                break;
            }

            for (const order of chunk) {
                const id = String(order.id);

                if (!seenIds.has(id)) {
                    seenIds.add(id);
                    allOrders.push(order);
                }
            }

            if (chunk.length < LIMIT) {
                break;
            }

            const maxId = Math.max(
                ...chunk
                    .map((item) => Number(item.id))
                    .filter((id) => Number.isFinite(id))
            );

            if (!Number.isFinite(maxId)) {
                break;
            }

            if (lastId !== undefined && maxId <= lastId) {
                break;
            }

            lastId = maxId;
        }

        return NextResponse.json({ orders: allOrders });
    } catch (error) {
        console.error("Failed to fetch agent orders from CRM:", error);

        return NextResponse.json(
            { error: "FAILED_TO_FETCH_ORDERS" },
            { status: 500 }
        );
    }
}
