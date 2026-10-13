"use client";

import { useMemo, useState } from "react";
import { sortOrdersByIdDesc, type OrderTableRow } from "@/entities/order";
import { useOrders } from "../api/useOrders";

import Loader from "@/components/shared/loader/Loader";
import Category from "./Category";
import { OrdersFilters, filterOrders, type OrdersFiltersState } from "@/features/order-filters";
import DetailsModal from "@/widgets/orders-workspace/ui/DetailsModal";
import Backdrop from "@/components/shared/backdrop/Backdrop";

import Pagination from "@/components/shared/pagination/Pagination";
import useOrdersPerPage from "@/hooks/useOrdersPerPage";

type OrdersContentProps = {
  mode?: "active" | "archive" | "all";
  variant?: "agent" | "agency";
  apiUrl?: string;
};

export default function OrdersContent({
  mode = "active",
  variant = "agent",
  apiUrl = "/api/agent/tours",
}: OrdersContentProps) {
  const [isPopUpShown, setIsPopUpShown] = useState(false);
  const [tourDetails, setTourDetails] = useState<{
    comment?: string;
    details?: OrderTableRow["details"];
  }>({});
  const { tours, agentOptions, skippedAgents, isLoading, loadError, retry } = useOrders(
    apiUrl,
    mode,
  );
  const [filters, setFilters] = useState<OrdersFiltersState>({
    search: "",
    agentId: null,
    status: null,
    hasDebt: null,
    period: { from: null, to: null },
  });

  const filteredOrders = useMemo(() => filterOrders(tours, filters), [tours, filters]);

  const sortedOrders = useMemo(
    () =>
      sortOrdersByIdDesc(filteredOrders).map((order, index) => ({
        ...order,
        index: index + 1,
      })),
    [filteredOrders],
  );
  const statusOptions = useMemo(() => {
    const map = new Map<string, string>();

    for (const order of tours) {
      if (order.status) {
        map.set(order.status, order.status);
      }
    }

    return Array.from(map, ([key, label]) => ({ key, label })).sort((a, b) =>
      a.label.localeCompare(b.label, "uk"),
    );
  }, [tours]);
  const hasLoadError = loadError !== null;

  const showTourDetails = (id: string | number) => {
    setIsPopUpShown(true);

    const selectedTour = tours.find((tour) => tour.id === id);
    if (!selectedTour) {
      setTourDetails({});
      return;
    }

    const { comment, details } = selectedTour;
    setTourDetails({ comment, details });
  };

  if (isLoading) return <Loader />;

  return (
    <div
      className="flex flex-col
                    gap-y-6
                    pl-4 xs:pl-[25px] xl:pl-[80px]
                    sm:ml-[calc((100vw-640px)/2)]
                    md:ml-[calc((100vw-768px)/2)]
                    lg:ml-[calc((100vw-1024px)/2)]
                    xl:ml-[calc((100vw-1280px)/2)]"
    >
      <DetailsModal
        {...tourDetails}
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
      />

      <Backdrop
        isVisible={isPopUpShown}
        onClick={() => {
          setIsPopUpShown(false);
        }}
      />

      <OrdersFilters
        filters={filters}
        onChange={setFilters}
        showAgentFilter={variant === "agency"}
        showDebtFilter={variant !== "agency"}
        agentOptions={agentOptions}
        statusOptions={statusOptions}
      />

      {variant === "agency" && skippedAgents.length > 0 && (
        <div className="mr-4 xs:mr-[25px] xl:mr-[80px] rounded-[8px] border border-main/40 bg-main/5 px-4 py-3 text-14reg">
          <p className="text-14semi">Не всі агенти потрапили у вибірку заявок</p>
          <p className="mt-1">
            У цих агентів не заповнений CRM ID:{" "}
            {skippedAgents.map((agent) => agent.name).join(", ")}.
          </p>
        </div>
      )}

      {loadError === "fetch-failed" && (
        <div className="flex flex-col items-center gap-4 pr-4 xs:pr-[25px] xl:pr-[80px] text-center">
          <p className="text-16reg">Не вдалося завантажити замовлення. Спробуйте ще раз.</p>
          <button
            type="button"
            onClick={retry}
            className="flex items-center justify-center h-12 px-8 text-14med rounded-full border border-main bg-main text-white
                        xl:hover:brightness-[135%] focus-visible:brightness-[135%] transition duration-300 ease-in-out"
          >
            Повторити
          </button>
        </div>
      )}

      {loadError === "crm-id-missing" && (
        <div className="flex flex-col items-center gap-2 pr-4 xs:pr-[25px] xl:pr-[80px] text-center">
          <p className="text-16reg">Ваш профіль ще не прив&apos;язаний до OneBox OS.</p>
          <p className="text-14light">
            Зверніться до адміністратора, щоб додати CRM ID до профілю агента.
          </p>
        </div>
      )}

      {!hasLoadError && !sortedOrders.length && (
        <p className="text-center text-16reg">Нічого не знайдено</p>
      )}

      {!hasLoadError && Boolean(sortedOrders.length) && (
        <Pagination
          items={sortedOrders}
          scrollTargetId="orders-table"
          useItemsPerPage={useOrdersPerPage}
          renderItems={(paginatedOrders) => (
            <Category
              variant={variant}
              showTourDetails={showTourDetails}
              category={{
                orders: paginatedOrders,
              }}
            />
          )}
        />
      )}
    </div>
  );
}
