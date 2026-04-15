"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Loader from "@/components/shared/loader/Loader";
import Category from "./Category";
import OrdersFilters, {
    OrdersFiltersState,
} from "./OrdersFilters";
import DetailsModal from "@/components/agent/menu/content/DetailsModal";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import "./order-filters.css";

import Pagination from "@/components/shared/pagination/Pagination";
import useOrdersPerPage from "@/hooks/useOrdersPerPage";

export interface OrderTableRow {
    id: string;
    index: number;
    orderNumber: string;
    tourTitle: string;
    daysQuantity: number;
    tourists: string;
    totalCost: number;
    commission: number;
    paidAmount: number;
    remainingAmount: number;
    startDate: string;
    endDate: string;
    status: string;
    comment: string;
    details?: {
        index: number;
        pib: string;
        birthday: string;
        phone: string;
        passport: string;
        passportFinish: string;
        city: string;
    }[];
}

type OrdersContentProps = {
    mode?: "active" | "archive" | "all";
};

function toTimeStart(value: unknown): number | null {
    if (!value) return null;

    if (value instanceof Date) {
        const time = value.getTime();
        return Number.isNaN(time) ? null : time;
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "year" in value &&
        "month" in value &&
        "day" in value
    ) {
        const v = value as { year: number; month: number; day: number };
        const date = new Date(v.year, v.month - 1, v.day, 0, 0, 0, 0);
        const time = date.getTime();
        return Number.isNaN(time) ? null : time;
    }

    return null;
}

function toTimeEnd(value: unknown): number | null {
    if (!value) return null;

    if (value instanceof Date) {
        const time = value.getTime();
        return Number.isNaN(time) ? null : time;
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "year" in value &&
        "month" in value &&
        "day" in value
    ) {
        const v = value as { year: number; month: number; day: number };
        const date = new Date(v.year, v.month - 1, v.day, 23, 59, 59, 999);
        const time = date.getTime();
        return Number.isNaN(time) ? null : time;
    }

    return null;
}

function parseOrderDate(
    value: string | null | undefined,
    endOfDay = false
): number | null {
    if (!value) return null;

    let normalized = value;

    if (value.includes(".")) {
        const [day, month, year] = value.split(".");
        normalized = `${year}-${month}-${day}`;
    }

    const date = endOfDay
        ? new Date(`${normalized}T23:59:59.999`)
        : new Date(`${normalized}T00:00:00.000`);

    const time = date.getTime();
    return Number.isNaN(time) ? null : time;
}

function filterOrders(
    orders: OrderTableRow[],
    filters: OrdersFiltersState
) {
    const periodFrom = toTimeStart(filters.period.from);
    const periodTo = toTimeEnd(filters.period.to);

    return orders.filter((order) => {
        if (filters.search.trim().length >= 2) {
            const q = filters.search.trim().toLowerCase();

            const haystack = `
                ${order.tourTitle}
                ${order.tourists}
            `.toLowerCase();

            if (!haystack.includes(q)) {
                return false;
            }
        }

        if (filters.status && order.status !== filters.status) {
            return false;
        }

        if (filters.hasDebt === "так") {
            if (Number(order.remainingAmount) === 0) {
                return false;
            }
        }

        if (filters.hasDebt === "ні") {
            if (Number(order.remainingAmount) !== 0) {
                return false;
            }
        }

        if (periodFrom !== null || periodTo !== null) {
            const orderStart = parseOrderDate(order.startDate, false);
            const orderEnd = parseOrderDate(order.endDate, true);

            if (orderStart === null || orderEnd === null) {
                return false;
            }

            if (periodFrom !== null && orderEnd < periodFrom) {
                return false;
            }

            if (periodTo !== null && orderStart > periodTo) {
                return false;
            }
        }

        return true;
    });
}

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

const archiveOrderStatusList = ["42", "48", "84"];

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

const transformOrders = (result: any[]): OrderTableRow[] => {
    return result.map((item, idx) => ({
        id: item.id,
        index: idx + 1,
        orderNumber: item.number || item.id || "",
        tourTitle: item.customfields?.Nazvaturu?.value || "",
        daysQuantity: item.customfields?.Dataturut?.value &&
        item.customfields?.Datazakinchennyaturu?.value
            ? getDaysQuantity(
                item.customfields.Dataturut.value,
                item.customfields.Datazakinchennyaturu.value
            )
            : 0,
        tourists: item.orderproducts?.map((product: any) => product.name).join(" ") || "",
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
        status: statusList[item.statusid] || "Невідомий статус",
        comment: item.customfields?.Dodatkovidani?.value || "",
        details: item.orderproducts?.map((product: any, index: number) => ({
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

function isTodayOrFuture(dateStr: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    return date >= today;
}

export default function OrdersContent({
                                          mode = "active",
                                      }: OrdersContentProps) {
    const [isPopUpShown, setIsPopUpShown] = useState(false);
    const [tourDetails, setTourDetails] = useState<{
        comment?: string;
        details?: OrderTableRow["details"];
    }>({});
    const [tours, setTours] = useState<OrderTableRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<OrdersFiltersState>({
        search: "",
        status: null,
        hasDebt: null,
        period: { from: null, to: null },
    });

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const { data } = await axios.get("/api/agent/tours", {
                    withCredentials: true,
                });

                const orders = Array.isArray(data?.orders) ? data.orders : [];

                let preparedOrders = orders;

                if (mode === "active") {
                    preparedOrders = orders
                        .filter(
                            ({ statusid }: { statusid: string }) =>
                                !archiveOrderStatusList.includes(statusid)
                        )
                        .filter((item: any) => {
                            const value =
                                item.customfields?.Datazakinchennyaturu?.value;

                            if (!value) return false;

                            return isTodayOrFuture(value);
                        });
                }

                if (mode === "archive") {
                    preparedOrders = orders.filter(
                        ({ statusid }: { statusid: string }) =>
                            archiveOrderStatusList.includes(statusid)
                    );
                }

                if (mode === "all") {
                    preparedOrders = orders;
                }

                const transformData = transformOrders(preparedOrders);
                setTours(transformData);
            } catch (error) {
                console.error(error);
                setTours([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTours();
    }, [mode]);

    const filteredOrders = useMemo(
        () => filterOrders(tours, filters),
        [tours, filters]
    );

    const showTourDetails = (id: string) => {
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

            <OrdersFilters filters={filters} onChange={setFilters} />

            {!filteredOrders.length && (
                <p className="text-center text-16reg">
                    Нічого не знайдено
                </p>
            )}

            {/*{Boolean(filteredOrders.length) && (*/}
            {/*    <Category*/}
            {/*        showTourDetails={showTourDetails}*/}
            {/*        category={{*/}
            {/*            orders: filteredOrders,*/}
            {/*        }}*/}
            {/*    />*/}
            {/*)}*/}
            {Boolean(filteredOrders.length) && (
                <Pagination
                    items={filteredOrders}
                    scrollTargetId="orders-table"
                    useItemsPerPage={useOrdersPerPage}
                    renderItems={(paginatedOrders) => (
                        <Category
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
