"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/shared/loader/Loader";
import Category from "./Category";

type Tour = {
    id: string;
    title: string;
};

export default function OrdersContent() {
    const [tours, setTours] = useState<Tour[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await fetch("/api/agent/tours", {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch tours");
                }

                const data = await res.json();
                setTours(data.tours || []);
            } catch {
                setTours([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTours();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!tours || tours.length === 0) {
        return (
            <p className="pl-4 xs:pl-[25px] xl:pl-[80px] text-center text-16reg">
                На жаль, турів поки що немає
            </p>
        );
    }

    return (
        <ul
            className="flex flex-col gap-y-10 xl:gap-y-[120px] pl-4 xs:pl-[25px] xl:pl-[80px]
      sm:ml-[calc((100vw-640px)/2)] md:ml-[calc((100vw-768px)/2)]
      lg:ml-[calc((100vw-1024px)/2)] xl:ml-[calc((100vw-1280px)/2)]"
        >
            {tours.map((tour, idx) => (
                //@ts-expect-error
                <Category key={idx} category={tour} />
            ))}
        </ul>
    );
}
