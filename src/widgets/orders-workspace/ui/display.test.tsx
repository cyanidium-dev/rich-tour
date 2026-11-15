import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import OrderItem from "./OrderItem";
import { transformOrders, parseCrmOrders } from "@/entities/order";
it.each([
  ["120", "120 €"],
  ["0", "0 €"],
  [null, "—"],
])("renders order details with commission %s in both account variants", (commission, expected) => {
  const order = transformOrders(
    parseCrmOrders([
      {
        id: 10268,
        externalid: "f26a034c-5158-41c1-8bba-82ecf87a1c8c",
        statusid: "47",
        customfields: {
          Nazvaturu: { value: "Карпати" },
          zagalsumabezkomisi: { value: "1200" },
          zagalnasumapokomisi: { value: commission },
        },
        agent: { id: "agent", name: "Agency agent", crmId: 5 },
      },
    ]),
  )[0];
  for (const variant of ["agent", "agency"] as const) {
    const html = renderToStaticMarkup(
      <table>
        <tbody>
          <OrderItem order={order} variant={variant} showTourDetails={() => {}} />
        </tbody>
      </table>,
    );
    expect(html).toContain("#10268");
    expect(html).not.toContain("f26a034c-5158-41c1-8bba-82ecf87a1c8c");
    expect(html).toContain("Карпати");
    const cells = Array.from(html.matchAll(/<td[^>]*>(.*?)<\/td>/g), (match) => match[1]);
    expect(cells[5]).toBe(expected);
    expect(html).not.toContain("1200 €");
    expect(html).toContain("Повна оплата");
    expect(html.includes("Agency agent")).toBe(variant === "agency");
  }
});
