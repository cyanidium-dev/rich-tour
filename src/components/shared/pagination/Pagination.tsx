"use client";
import { useState, useEffect, ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fadeInAnimation } from "../animation/animationVariants";
import ArrowInCircleIcon from "../icons/ArrowInCircleIcon";
import AnimatedWrapper from "../animation/AnimatedWrapper";

interface PaginationProps<T> {
  items: T[];
  renderItems: (items: T[]) => ReactNode;
  scrollTargetId: string;
  useItemsPerPage: () => number;
  maxVisiblePages?: number;
  className?: string;
}

export default function Pagination<T>({
  items,
  renderItems,
  scrollTargetId,
  useItemsPerPage,
  maxVisiblePages = 4,
  className = "",
}: PaginationProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(page);
  const itemsPerPage = useItemsPerPage();
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });

    const targetElement = document.getElementById(scrollTargetId);
    if (targetElement) {
      const yOffset = -120; // Зміщення на 120px вгору
      const yPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: yPosition,
      });
    }
  };

  return (
    <>
      <div className={`${className}`}>{renderItems(currentItems)}</div>
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="flex justify-center items-center gap-[33px] mt-9 mx-auto"
      >
        <button
          aria-label="left"
          className={`flex justify-center items-center p-[10.5] size-[42px] rounded-[7.6px] 
          shadow-pagination transition duration-300 ease-in-out
          enabled:hover:brightness-125 enabled:active:scale-95 enabled:focus-visible:brightness-125
          ${page === 1 ? "bg-white text-black" : "bg-main text-white"}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={page === 1}
        >
          <ArrowInCircleIcon className="size-[21px] rotate-180" />
        </button>

        <div>
          {pageNumbers.map((page) => (
            <button
              key={page}
              aria-label={page.toString()}
              className={`px-[8px] py-2 text-16med transition duration-300 ease-in-out
            ${page === currentPage ? "text-main" : " xl:hover:text-main"}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          aria-label="right"
          className={`flex justify-center items-center p-[10.5px] size-[42px] rounded-[7.6px] transition duration-300 ease-in-out
           shadow-pagination enabled:hover:brightness-125 enabled:active:scale-95 enabled:focus-visible:brightness-125
          ${
            currentPage === totalPages
              ? "text-black bg-white"
              : "bg-main text-white"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={page === totalPages}
        >
          <ArrowInCircleIcon className="size-[21px]" />
        </button>
      </AnimatedWrapper>
    </>
  );
}
