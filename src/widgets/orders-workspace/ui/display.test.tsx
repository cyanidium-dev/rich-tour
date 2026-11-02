import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import OrderItem from "./OrderItem";
import { transformOrders, parseCrmOrders } from "@/entities/order";
it("renders the CRM order number and order details in both account variants", () => {
  const order = transformOrders(
    parseCrmOrders([
      {
        id: 10268,
        externalid: "f26a034c-5158-41c1-8bba-82ecf87a1c8c",
        statusid: "47",
        customfields: { Nazvaturu: { value: "Карпати" }, zagalsumabezkomisi: { value: "1200" } },
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
    expect(html).toContain("1200 €");
    expect(html).toContain("Повна оплата");
    expect(html.includes("Agency agent")).toBe(variant === "agency");
  }
});
