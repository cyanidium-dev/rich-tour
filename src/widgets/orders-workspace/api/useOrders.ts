import { useEffect, useState } from "react";
import axios from "axios";
import {
  parseOrdersResponse,
  prepareOrders,
  type OrderTableRow,
  type OrdersMode,
} from "@/entities/order";
import type { AgentFilterOption } from "@/features/order-filters";
type LoadError = "crm-id-missing" | "fetch-failed";
type SkippedAgent = { id: string; name: string };

export function useOrders(apiUrl: string, mode: OrdersMode) {
  const [tours, setTours] = useState<OrderTableRow[]>([]);
  const [agentOptions, setAgentOptions] = useState<AgentFilterOption[]>([]);
  const [skippedAgents, setSkippedAgents] = useState<SkippedAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<LoadError | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const { data } = await axios.get<unknown>(apiUrl, {
          withCredentials: true,
        });
        const { orders, agents, skippedAgents } = parseOrdersResponse(data);
        setAgentOptions(agents);
        setSkippedAgents(skippedAgents);
        setTours(prepareOrders(orders, mode));
      } catch (error) {
        console.error("Failed to load agent orders:", error);
        const isCrmIdMissing =
          axios.isAxiosError(error) && error.response?.data?.error === "CRM_ID_MISSING";

        setLoadError(isCrmIdMissing ? "crm-id-missing" : "fetch-failed");
        setTours([]);
        setAgentOptions([]);
        setSkippedAgents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [apiUrl, mode, retryKey]);

  return {
    tours,
    agentOptions,
    skippedAgents,
    isLoading,
    loadError,
    retry: () => setRetryKey((key) => key + 1),
  };
}
