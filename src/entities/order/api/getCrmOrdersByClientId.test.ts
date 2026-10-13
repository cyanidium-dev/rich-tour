import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("axios", () => ({ default: { post: vi.fn(), isAxiosError: vi.fn(() => false) } }));
vi.mock("@/shared/api/crm-server", () => ({ getCrmToken: vi.fn(async () => "test-token") }));
import axios from "axios";
import { getCrmOrdersByClientId } from "./getCrmOrdersByClientId";

beforeEach(() => vi.clearAllMocks());

it("retains pagination, request fields, deduplication and CRM order values", async () => {
  const first = Array.from({ length: 200 }, (_, index) => ({ id: index + 1, clientname: "Agent" }));
  vi.mocked(axios.post).mockResolvedValueOnce({ data: { dataArray: first } });
  vi.mocked(axios.post).mockResolvedValueOnce({
    data: { dataArray: [{ id: 200 }, { id: "201", extra: "kept" }] },
  });
  const orders = await getCrmOrdersByClientId("client-1");
  expect(orders).toEqual([...first, { id: "201", extra: "kept" }]);
  const requests = vi.mocked(axios.post).mock.calls;
  const payloads = requests.map(
    ([, payload]) =>
      payload as {
        filter: { clientid: string; workflowid: string; lastid?: number };
        fields: string[];
        orderproductfields: string[];
      },
  );
  expect(requests).toHaveLength(2);
  expect(requests[0][1]).toMatchObject({
    limit: 200,
    filter: { clientid: "client-1", workflowid: "5" },
  });
  expect(payloads[0].filter).not.toHaveProperty("lastid");
  expect(payloads[1].filter).toEqual({ clientid: "client-1", workflowid: "5", lastid: 200 });
  expect(payloads[1].fields).toEqual(payloads[0].fields);
  expect(payloads[1].orderproductfields).toEqual(payloads[0].orderproductfields);
  expect(requests[0][2]?.headers).toEqual({
    token: "test-token",
    "Content-Type": "application/json",
  });
});

it("retains an empty result for missing CRM dataArray", async () => {
  vi.mocked(axios.post).mockResolvedValue({ data: {} });
  expect(await getCrmOrdersByClientId("client-1")).toEqual([]);
  expect(axios.post).toHaveBeenCalledTimes(1);
});
