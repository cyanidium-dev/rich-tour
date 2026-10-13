import { describe, expect, it } from "vitest";
import { transformOrders } from "./mapOrders";
import { parseCrmOrders } from "./schema";
describe("CRM orders", () => {
  it("preserves order, identifiers, labels, money and passenger details", () => {
    const input = [
      {
        id: 12,
        externalid: "REQ-12",
        statusid: "47",
        extra: "keep",
        customfields: {
          Nazvaturu: { value: "Карпати" },
          Dataturut: { value: "2026-10-01" },
          Datazakinchennyaturu: { value: "2026-10-03" },
          zagalsumabezkomisi: { value: "1200.50" },
          Zalishilosoplatitipozayavtsi: { value: "0" },
        },
        orderproducts: [
          {
            name: "Іван",
            customfields: { Datanarya: { value: "1990-02-03" }, Pasport: { value: "AB123" } },
          },
        ],
      },
      { id: "9", statusid: "999", statusname: "CRM label" },
    ];
    const parsed = parseCrmOrders(input);
    expect(parsed[0].extra).toBe("keep");
    const rows = transformOrders(parsed);
    expect(rows.map((row) => row.id)).toEqual([12, "9"]);
    expect(rows[0]).toMatchObject({
      index: 1,
      orderNumber: "REQ-12",
      tourTitle: "Карпати",
      daysQuantity: 3,
      totalCost: 1200.5,
      remainingAmount: 0,
      startDate: "01.10.2026",
      endDate: "03.10.2026",
      status: "Повна оплата",
      tourists: "Іван",
    });
    expect(rows[0].details?.[0]).toMatchObject({
      index: 1,
      pib: "Іван",
      birthday: "03.02.1990",
      passport: "AB123",
    });
    expect(rows[1]).toMatchObject({
      index: 2,
      orderNumber: "9",
      status: "CRM label",
      tourists: "",
      details: [],
    });
  });
  it("retains unknown status fallback and rejects malformed external data", () => {
    expect(transformOrders(parseCrmOrders([{ id: "1", statusid: "999" }]))[0].status).toBe(
      "Статус CRM #999",
    );
    expect(() => parseCrmOrders([{ id: 1, orderproducts: { name: "wrong" } }])).toThrow();
    expect(() => parseCrmOrders([{ statusid: "47" }])).toThrow();
  });
});
