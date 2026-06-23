import { getAgentOrdersFromCrm } from "@/lib/crm/getAgentOrdersFromCrm";

type CrmOrder = {
    id: string | number;
    [key: string]: unknown;
};

const LIMIT = 200;

const orderFields = [
    "id",
    "clientname",
    "externalid",
    "statusid",
    "statusname",
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
];

const orderProductFields = [
    "name",
    "customfields.Datanarya",
    "customfields.Telefon",
    "customfields.Pasport",
    "customfields.Mistoposadki",
    "customfields.Datazavershpasp",
];

export async function getCrmOrdersByClientId(clientId: string | number) {
    const basePayload = {
        limit: LIMIT,
        filter: {
            clientid: clientId,
        },
        fields: orderFields,
        orderproductfields: orderProductFields,
    };

    const allOrders: CrmOrder[] = [];
    const seenIds = new Set<string>();
    let lastId: number | undefined;

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

        for (const order of chunk as CrmOrder[]) {
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
                .map((item: CrmOrder) => Number(item.id))
                .filter((id: number) => Number.isFinite(id))
        );

        if (!Number.isFinite(maxId)) {
            break;
        }

        if (lastId !== undefined && maxId <= lastId) {
            break;
        }

        lastId = maxId;
    }

    return allOrders;
}
