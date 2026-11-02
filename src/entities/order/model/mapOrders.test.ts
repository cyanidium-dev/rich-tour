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
          Zagalnasumapozayavtsi: { value: "1200.50" },
          zagalsumabezkomisi: { value: "1080.45" },
          zagalnasumapokomisi: { value: "120.05" },
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
      orderNumber: "#12",
      tourTitle: "Карпати",
      daysQuantity: 3,
      totalCost: 1200.5,
      costWithoutCommission: 1080.45,
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
      orderNumber: "#9",
      status: "CRM label",
      tourists: "",
      details: [],
    });
  });
  it.each([10268, "10268"])(
    "uses CRM id %s as the order number instead of external identifiers",
    (id) => {
      const [row] = transformOrders(
        parseCrmOrders([
          { id, externalid: "f26a034c-5158-41c1-8bba-82ecf87a1c8c", number: "OTHER-123" },
        ]),
      );

      expect(row.id).toBe(id);
      expect(row.orderNumber).toBe("#10268");
    },
  );

  it("retains unknown status fallback and rejects malformed external data", () => {
    expect(transformOrders(parseCrmOrders([{ id: "1", statusid: "999" }]))[0].status).toBe(
      "Статус CRM #999",
    );
    expect(() => parseCrmOrders([{ id: 1, orderproducts: { name: "wrong" } }])).toThrow();
    expect(() => parseCrmOrders([{ statusid: "47" }])).toThrow();
  });

  it("maps CRM price components, options and stored totals without recalculating them", () => {
    const [row] = transformOrders(
      parseCrmOrders([
        {
          id: 1,
          customfields: {
            Tipharchuvannya: { value: " HB " },
            Zagalnasumapozayavtsi: { value: "999" },
            zagalnasumapokomisi: { value: "38" },
          },
          orderproducts: [
            {
              name: "Турист",
              customfields: {
                Tarif: { value: "418" },
                Prozhya: { value: "35" },
                Harya: { value: 12.5 },
                Kondits: { value: "0" },
                Kotedzh: { value: " TWIN " },
                Strahivka: { value: "Так" },
                Strahivkasuma: { value: "10" },
                Platnimistsya: { value: "Ні" },
                Platazamistse: { value: 0 },
                Turzbir: { value: "42.35" },
                Zagalnasuma: { value: "999" },
                Komisiya: { value: "38" },
                dosplatibezkomisi: { value: "961" },
              },
            },
          ],
        },
      ]),
    );
    expect(row).toMatchObject({ totalCost: 999, commission: 38, mealType: "HB" });
    expect(row.details?.[0].cost).toEqual({
      tariff: 418,
      accommodation: 35,
      meals: 12.5,
      airConditioning: 0,
      room: "TWIN",
      insurance: "Так",
      insuranceAmount: 10,
      frontSeats: "Ні",
      frontSeatsAmount: 0,
      touristTax: 42.35,
      total: 999,
      commission: 38,
      withoutCommission: 961,
    });
  });

  it.each([
    [undefined, null],
    [null, null],
    ["", null],
    ["  ", null],
    ["invalid", null],
    ["NaN", null],
    ["Infinity", null],
    ["0", 0],
    [0, 0],
    ["12.50", 12.5],
    [12.5, 12.5],
  ])("normalizes new money values %s to %s", (value, expected) => {
    const [row] = transformOrders(
      parseCrmOrders([
        {
          id: 1,
          customfields: { zagalnasumapokomisi: { value } },
          orderproducts: [{ name: "Турист", customfields: { Tarif: { value } } }],
        },
      ]),
    );
    expect(row.commission).toBe(expected);
    expect(row.details?.[0].cost?.tariff).toBe(expected);
  });

  it("keeps missing prices and options unknown for legacy orders", () => {
    const [row] = transformOrders(
      parseCrmOrders([
        {
          id: 1,
          orderproducts: [{ name: "Турист" }],
        },
      ]),
    );
    expect(row.commission).toBeNull();
    expect(row.mealType).toBeNull();
    expect(Object.values(row.details?.[0].cost ?? {})).toEqual(Array(13).fill(null));
  });
});
