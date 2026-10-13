import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import OrderItem from "./OrderItem";
import { transformOrders, parseCrmOrders } from "@/entities/order";
it("renders orders with the existing displayed values in both account variants", () => {
  const order = transformOrders(
    parseCrmOrders([
      {
        id: 12,
        externalid: "REQ-12",
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
    expect(html).toContain("REQ-12");
    expect(html).toContain("Карпати");
    expect(html).toContain("1200 €");
    expect(html).toContain("Повна оплата");
    expect(html.includes("Agency agent")).toBe(variant === "agency");
  }
});
