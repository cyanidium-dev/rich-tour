"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Loader from "@/components/shared/loader/Loader";
import Category from "./Category";
import OrdersFilters, {
    OrdersFiltersState,
} from "./OrdersFilters";
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

function filterOrders(
    orders: OrderTableRow[],
    filters: OrdersFiltersState
) {
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
            // есть долг ИЛИ значение отсутствует (прочерк)
            if (
                order.remainingAmount === 0
            ) {
                return false;
            }
        }

        if (filters.hasDebt === "ні") {
            // нет долга — строго 0
            if (order.remainingAmount !== 0) {
                return false;
            }
        }

        /* 📅 ПЕРІОД (по startDate) */
        if (filters.period.from || filters.period.to) {
            // если даты отсутствуют — исключаем
            if (!order.startDate || !order.endDate) {
                return false;
            }

            const orderStart = new Date(order.startDate);
            const orderEnd = new Date(order.endDate);

            // защита от Invalid Date
            if (isNaN(orderStart.getTime()) || isNaN(orderEnd.getTime())) {
                return false;
            }

            if (
                (filters.period.from && orderEnd < filters.period.from) ||
                (filters.period.to && orderStart > filters.period.to)
            ) {
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

    return diffDays;
}

// Нова заявка - 36
// В роботі - 39
// Дані внесено - 40
// Відправлено на підтвердження - 41
// Підтверджено. Чекаю оплату завдатку - 43
// Оплачено завдаток - 44
// Оплата залишкової вартості туру - 45
// Повна оплата - 47
// Тур завершено - 48
// Відправлено на оплату - 46
// Відмова від заявки - 42
// Кошти повернуто - 84

const transformOrders = result => {
    const data = result.map((item, idx) => ({
        id: item.id,
        index: idx + 1,
        orderNumber: item.externalid.slice(0, 6),
        tourTitle: item.customfields.Nazvaturu ? item.customfields.Nazvaturu.value : "",
        daysQuantity: item.customfields.Dataturut ? getDaysQuantity(item.customfields.Dataturut.value, item.customfields.Datazakinchennyaturu.value) : "",
        tourists: item.orderproducts.map(item => item.name).join(" "),
        totalCost: item.customfields.zagalsumabezkomisi ? item.customfields.zagalsumabezkomisi.value : "",
        commission: "",
        paidAmount: item.customfields.Zalishilosoplatitipozayavtsi ? Number(item.customfields?.zagalsumabezkomisi.value) - Number(item.customfields?.Zalishilosoplatitipozayavtsi.value) : 0,
        remainingAmount: item.customfields.Zalishilosoplatitipozayavtsi ? item.customfields?.Zalishilosoplatitipozayavtsi.value : "",
        startDate: item.customfields.Dataturut ? item.customfields.Dataturut.value : "",
        endDate: item.customfields.Datazakinchennyaturu ? item.customfields.Datazakinchennyaturu.value : "",
        status: "не почався",
        comment: item.customfields.Dodatkovidani ? item.customfields.Dodatkovidani.value : "",
    }));
    return data;
}

export default function OrdersContent() {
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
                console.log(data);
                const transformData = transformOrders(data.orders) || [];
                setTours(transformData);
            } catch {
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


    if (isLoading) {
        return <Loader />;
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
            {/*{ordersMock.map((tour, idx) => (*/}
            {/*    //@ts-expect-error*/}
            {/*    <Category key={idx} category={tour} />*/}
            {/*))}*/}
            <OrdersFilters filters={filters} onChange={setFilters} />
            {!filteredOrders.length && (<p className="text-center text-16reg">
                Нічого не знайдено
            </p>)}
            {Boolean(filteredOrders.length) && <Category
                category={{
                    // @ts-expect-error
                    orders: filteredOrders,
                }}
            />}
        </div>
    );
}
