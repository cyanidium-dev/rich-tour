import { toCrmDate } from "@/lib/crm/utils/helpers";

interface MapBookingParams {
  requestId: string;
  tourId: number | string;
  crmTravelerIds: string[];
  date: string;
  travelersQty: number;
  message?: string;
  crmUserId?: number | null;
  name: string;
  email: string;
  phone: string;
}

type CrmBookingOrder = {
  externalid: string;
  findbyArray: string[];
  witheditevents: boolean;
  workflowid: string;
  statusid: string;
  parentid: number;
  sourceid: number;
  client: { name: string; emails: string[]; phones: string[] } | { userid: number };
  ordercontacts: Array<{ id: number }>;
  customfields: { Vibranadata: string; Kilkistturistiv: number; Dodatkovidani: string };
};

export function mapBookingToCrmOrder({
  requestId,
  tourId,
  crmTravelerIds,
  date,
  travelersQty,
  message,
  crmUserId,
  name,
  email,
  phone,
}: MapBookingParams) {
  const order: CrmBookingOrder = {
    externalid: requestId,
    findbyArray: ["externalid"],
    witheditevents: true,
    workflowid: "5",
    statusid: "35",
    parentid: Number(tourId),
    sourceid: crmUserId ? 2 : 1,
    client: {
      name,
      emails: [email],
      phones: [phone],
    },

    ordercontacts: crmTravelerIds.map((id) => ({
      id: Number(id),
    })),

    customfields: {
      Vibranadata: toCrmDate(date),
      Kilkistturistiv: travelersQty,
      Dodatkovidani: message || "",
      //     Mistoposadki
    },
  };

  // ✅ Добавляем только для авторизованного агента
  if (crmUserId) {
    order.client = {
      userid: crmUserId,
    };
  }

  return [order];
}
