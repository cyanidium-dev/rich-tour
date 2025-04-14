"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories } from "../home/promotion/mockedData";
import TabMenuItem from "./TabMenuItem";
import { Category } from "@/types/categories";

export default function TabMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const category = searchParams.get("category") || "all";
  const [activeTab, setActiveTab] = useState(category);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.get("category")) {
      params.set("category", "all");
    }
    if (!params.get("page")) {
      params.set("page", "1");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  if (!categories || !categories?.length) return null;

  const categoriesList = [{ title: "Всі тури", value: "all" }, ...categories];

  const handleTabClick = (category: Category) => {
    setActiveTab(category?.value);
    if (pathName === "/tours") {
      const params = new URLSearchParams(window.location.search);
      params.set("category", category?.value);
      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <ul className="flex flex-col md:flex-row md:flex-wrap gap-y-[15px] gap-x-[14px] max-w-[410px] md:max-w-full mx-auto md:mx-0">
      {categoriesList.map((category, idx) => (
        <TabMenuItem
          key={idx}
          category={category}
          activeTab={activeTab}
          onClick={() => handleTabClick(category)}
        />
      ))}
    </ul>
  );
}
