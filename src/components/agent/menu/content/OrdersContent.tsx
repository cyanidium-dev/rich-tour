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

type Tour = {
    id: string;
    title: string;
};

export interface OrderTableRow {
    id: string;

    index: number;                 // П/П
    orderNumber: string;           // Номер замовлення
    tourTitle: string;             // Назва туру
    daysQuantity: number;           // Кількість днів

    tourists: string;              // Дані туристів
    totalCost: number;              // Вартість заявки
    commission: number;             // Комісія
    paidAmount: number;             // Внесено коштів
    remainingAmount: number;        // Залишок до сплати

    startDate: string;              // Дата початку
    endDate: string;                // Дата завершення
    status: | "не почався"
        | "в процесы"
        | "завершений"
        | "відмінений"; // Статус заявки
    comment: string;                // Коментар
}

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

function parseOrderDate(value: string | null | undefined, endOfDay = false): number | null {
    if (!value) return null;

    const date = endOfDay
        ? new Date(`${value}T23:59:59.999`)
        : new Date(`${value}T00:00:00.000`);

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
        /* 🔍 ПОИСК */
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

        /* 📌 СТАТУС */
        if (filters.status && order.status !== filters.status) {
            return false;
        }

        /* 💰 ЗАЛИШОК ДО СПЛАТИ */
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

        /* 📅 ПЕРІОД */
        if (periodFrom !== null || periodTo !== null) {
            const orderStart = parseOrderDate(order.startDate, false);
            const orderEnd = parseOrderDate(order.endDate, true);

            if (orderStart === null || orderEnd === null) {
                return false;
            }

            // пересечение диапазонов:
            // заказ заканчивается раньше выбранного периода
            if (periodFrom !== null && orderEnd < periodFrom) {
                return false;
            }

            // заказ начинается позже выбранного периода
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

const statusList = {
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
}

const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return "—";

    // уже в нужном формате
    if (dateStr.includes(".")) {
        return dateStr;
    }

    // формат YYYY-MM-DD
    if (dateStr.includes("-")) {
        const [y, m, d] = dateStr.split("-");
        return `${d}.${m}.${y}`;
    }

    return dateStr; // fallback
};

const transformOrders = result => {
    const data = result.map((item, idx) => ({
        id: item.id,
        index: idx + 1,
        tourTitle: item.customfields.Nazvaturu ? item.customfields.Nazvaturu.value : "",
        daysQuantity: item.customfields.Dataturut ? getDaysQuantity(item.customfields.Dataturut.value, item.customfields.Datazakinchennyaturu.value) : "",
        tourists: item.orderproducts.map(item => item.name).join(" "),
        totalCost: item.customfields.zagalsumabezkomisi ? item.customfields.zagalsumabezkomisi.value : "",
        commission: item.customfields.zagalnasumapokomisi?.value ? item.customfields.zagalnasumapokomisi?.value : "",
        paidAmount: item.customfields.Oplachenopozayavtsi ? Number(item.customfields.Oplachenopozayavtsi.value) : "",
        remainingAmount: item.customfields.Zalishilosoplatitipozayavtsi ? Number(item.customfields?.Zalishilosoplatitipozayavtsi.value) : "",
        startDate: item.customfields.Dataturut ? formatDate(item.customfields.Dataturut.value) : "",
        endDate: item.customfields.Datazakinchennyaturu ? formatDate(item.customfields.Datazakinchennyaturu.value) : "",
        status: statusList[item.statusid] || "не почався",
        comment: item.customfields.Dodatkovidani ? item.customfields.Dodatkovidani.value : "",
        details: item.orderproducts.map((item, index) => ({
            index: index + 1,
            pib: item.name,
            birthday: item.customfields.Datanarya?.value ? formatDate(item.customfields.Datanarya?.value) : "",
            phone: item.customfields.Telefon?.value || "",
            passport: item.customfields.Pasport?.value || "",
            passportFinish: item.customfields.Datazavershpasp?.value || "",
            city: item.customfields.Mistoposadki?.value || "",
        })),
    }));

    return data;
}

const archiveOrderStatusList = ["42", "48", "84"];

function isTodayOrFuture(dateStr: string): boolean {
    const today = new Date();

    // обнуляем время (важно!)
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    return date >= today;
}



export default function OrdersContent() {
    const [isPopUpShown, setIsPopUpShown] = useState(false);
    const [tourDetails, setTourDetails] = useState({});
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
                const {data} = await axios.get("/api/agent/tours", {
                    withCredentials: true,
                });

                const notArchiveOrders = data.orders.filter(({statusid}) => !archiveOrderStatusList.includes(statusid));

                const filtered = notArchiveOrders.filter((item) => {
                    const value = item.customfields?.Datazakinchennyaturu?.value;

                    if (!value) return false;

                    return isTodayOrFuture(value);
                });

                const transformData = transformOrders(filtered) || [];
                setTours(transformData);
            } catch(error) {
                console.error(error);
                setTours([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTours();
    }, []);

    const filteredOrders = useMemo(
        () => filterOrders(tours, filters),
        [tours, filters]
    );

    const showTourDetails = id => {
        setIsPopUpShown(true);
        //@ts-expect-error
        const {comment, details} = tours.find(tour => tour.id === id);
        setTourDetails({comment, details});
    }

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
            <DetailsModal {...tourDetails} isPopUpShown={isPopUpShown} setIsPopUpShown={setIsPopUpShown} />
            <Backdrop
                isVisible={isPopUpShown}
                onClick={() => {
                    setIsPopUpShown(false);
                }} />
            <OrdersFilters filters={filters} onChange={setFilters} />
            {!filteredOrders.length && (<p className="text-center text-16reg">
                Нічого не знайдено
            </p>)}
            {Boolean(filteredOrders.length) && <Category
                showTourDetails={showTourDetails}
                category={{
                    // @ts-expect-error
                    orders: filteredOrders,
                }}
            />}
        </div>
    );
}
