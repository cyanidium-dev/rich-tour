import { NextResponse } from "next/server";
import axios from "axios";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import {getAgentOrdersFromCrm} from "@/lib/crm/getAgentOrdersFromCrm";

export async function GET() {
    const user = await getAuthUser();

    if (!user || user.role !== "agent") {
        return NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 }
        );
    }

    const payload = {
        limit: 200,
        filter: {
            //@ts-expect-error
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
            "orderproducts"
        ],

        orderproductfields: [
            "name",
            "customfields.Datanarya",
            "customfields.Telefon",
            "customfields.Pasport",
            "customfields.Mistoposadki",
            "customfields.Datazavershpasp"
        ],
    };

    const orders = await getAgentOrdersFromCrm(payload);

    return NextResponse.json({ orders });
}
