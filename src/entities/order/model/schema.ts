import { z } from "zod";
const field = z.object({ value: z.union([z.string(), z.number()]).nullish() }).passthrough();
const dateField = z.object({ value: z.string().nullish() }).passthrough();
const fields = z
  .object({
    Nazvaturu: dateField.nullish(),
    Dataturut: dateField.nullish(),
    Datazakinchennyaturu: dateField.nullish(),
    Zagalnasumapozayavtsi: field.nullish(),
    zagalsumabezkomisi: field.nullish(),
    zagalnasumapokomisi: field.nullish(),
    Oplachenopozayavtsi: field.nullish(),
    Zalishilosoplatitipozayavtsi: field.nullish(),
    Dodatkovidani: dateField.nullish(),
    Datanarya: dateField.nullish(),
    Telefon: dateField.nullish(),
    Pasport: dateField.nullish(),
    Datazavershpasp: dateField.nullish(),
    Mistoposadki: dateField.nullish(),
    Tipharchuvannya: dateField.nullish(),
    PosilannyanaPidtverdzhennya: field.nullish(),
    Tarif: field.nullish(),
    Prozhya: field.nullish(),
    Harya: field.nullish(),
    Kondits: field.nullish(),
    Kotedzh: dateField.nullish(),
    Strahivka: dateField.nullish(),
    Strahivkasuma: field.nullish(),
    Platnimistsya: dateField.nullish(),
    Platazamistse: field.nullish(),
    Turzbir: field.nullish(),
    Zagalnasuma: field.nullish(),
    Komisiya: field.nullish(),
    dosplatibezkomisi: field.nullish(),
  })
  .passthrough();
export const crmOrderProductSchema = z
  .object({ name: z.string(), customfields: fields.nullish() })
  .passthrough();
export const crmOrderSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    externalid: z.union([z.string(), z.number()]).nullish(),
    number: z.union([z.string(), z.number()]).nullish(),
    statusid: z.union([z.string(), z.number()]).nullish(),
    statusname: z.string().nullish(),
    customfields: fields.nullish(),
    orderproducts: z.array(crmOrderProductSchema).nullish(),
    agent: z
      .object({
        id: z.string(),
        name: z.string(),
        crmId: z.union([z.string(), z.number()]).nullish(),
      })
      .optional(),
  })
  .passthrough();
export const parseCrmOrders = (value: unknown) => z.array(crmOrderSchema).parse(value);
// The existing API treats an omitted or non-array list as empty.
const orderListSchema = z.preprocess(
  (value) => (Array.isArray(value) ? value : []),
  z.array(crmOrderSchema),
);
const agentOptionSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
});
const agentListSchema = z.preprocess(
  (value) => (Array.isArray(value) ? value : []),
  z.array(agentOptionSchema),
);
const ordersResponseSchema = z.object({
  orders: orderListSchema,
  agents: agentListSchema,
  skippedAgents: agentListSchema,
});
const crmResponseSchema = z.object({ dataArray: orderListSchema });
export const parseOrdersResponse = (value: unknown) => ordersResponseSchema.parse(value);
export const parseCrmOrdersResponse = (value: unknown) => crmResponseSchema.parse(value).dataArray;
export type CrmOrder = z.infer<typeof crmOrderSchema>;
export type CrmOrderProduct = z.infer<typeof crmOrderProductSchema>;
