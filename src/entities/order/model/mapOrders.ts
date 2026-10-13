import type { OrderTableRow } from "./types";
import type { CrmOrder, CrmOrderProduct } from "./schema";
function getDaysQuantity(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays + 1;
}
const statusList: Record<string, string> = {
  "36": "Нова заявка",
  "39": "В роботі",
  "40": "Дані внесено",
  "41": "Відправлено на підтвердження",
  "42": "Відмова від заявки",
  "43": "Підтверджено. Чекаю оплату завдатку",
  "44": "Оплачено завдаток",
  "45": "Оплата залишкової вартості туру",
  "46": "Відправлено на оплату",
  "47": "Повна оплата",
  "48": "Тур завершено",
  "84": "Кошти повернуто",
};
const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "—";
  if (dateStr.includes(".")) {
    return dateStr;
  }
  if (dateStr.includes("-")) {
    const [y, m, d] = dateStr.split("-");
    return `${d}.${m}.${y}`;
  }
  return dateStr;
};
function getStatusLabel(item: CrmOrder): string {
  if (item.statusname) {
    return item.statusname;
  }
  if (item.statusid && statusList[item.statusid]) {
    return statusList[item.statusid];
  }
  if (item.statusid) {
    return `Статус CRM #${item.statusid}`;
  }
  return "Невідомий статус";
}
export const transformOrders = (result: CrmOrder[]): OrderTableRow[] => {
  return result.map((item, idx) => ({
    id: item.id,
    index: idx + 1,
    orderNumber: item.externalid || item.number || item.id || "",
    tourTitle: item.customfields?.Nazvaturu?.value || "",
    daysQuantity:
      item.customfields?.Dataturut?.value && item.customfields?.Datazakinchennyaturu?.value
        ? getDaysQuantity(
            item.customfields.Dataturut.value,
            item.customfields.Datazakinchennyaturu.value,
          )
        : 0,
    tourists: item.orderproducts?.map((product: CrmOrderProduct) => product.name).join(" ") || "",
    totalCost: item.customfields?.zagalsumabezkomisi?.value
      ? Number(item.customfields.zagalsumabezkomisi.value)
      : 0,
    commission: item.customfields?.zagalnasumapokomisi?.value
      ? Number(item.customfields.zagalnasumapokomisi.value)
      : 0,
    paidAmount: item.customfields?.Oplachenopozayavtsi?.value
      ? Number(item.customfields.Oplachenopozayavtsi.value)
      : 0,
    remainingAmount: item.customfields?.Zalishilosoplatitipozayavtsi?.value
      ? Number(item.customfields.Zalishilosoplatitipozayavtsi.value)
      : 0,
    startDate: item.customfields?.Dataturut?.value
      ? formatDate(item.customfields.Dataturut.value)
      : "",
    endDate: item.customfields?.Datazakinchennyaturu?.value
      ? formatDate(item.customfields.Datazakinchennyaturu.value)
      : "",
    statusId: item.statusid ? String(item.statusid) : undefined,
    status: getStatusLabel(item),
    comment: item.customfields?.Dodatkovidani?.value || "",
    agentId: item.agent?.id,
    agentName: item.agent?.name,
    agentCrmId: item.agent?.crmId,
    details:
      item.orderproducts?.map((product: CrmOrderProduct, index: number) => ({
        index: index + 1,
        pib: product.name,
        birthday: product.customfields?.Datanarya?.value
          ? formatDate(product.customfields.Datanarya.value)
          : "",
        phone: product.customfields?.Telefon?.value || "",
        passport: product.customfields?.Pasport?.value || "",
        passportFinish: product.customfields?.Datazavershpasp?.value
          ? formatDate(product.customfields.Datazavershpasp.value)
          : "",
        city: product.customfields?.Mistoposadki?.value || "",
      })) || [],
  }));
};
