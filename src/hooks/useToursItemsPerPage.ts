"use client";
import { useState, useEffect } from "react";

export const useToursItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setItemsPerPage(3);
      } else if (width < 768) {
        setItemsPerPage(4);
      } else if (width < 1024) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(8);
      }
    };

    updateItemsPerPage();

    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  return itemsPerPage;
};
