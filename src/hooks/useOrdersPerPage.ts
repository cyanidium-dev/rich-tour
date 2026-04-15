"use client";

import { useEffect, useState } from "react";

export default function useOrdersPerPage() {
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth >= 1280) {
                setItemsPerPage(10);
            } else if (window.innerWidth >= 768) {
                setItemsPerPage(8);
            } else {
                setItemsPerPage(5);
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);

    return itemsPerPage;
}
