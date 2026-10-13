"use client";

import { usePathname, useRouter } from "next/navigation";

import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import TabMenuItem from "./TabMenuItem";

export type TourCategory = { _id: string; title: string };

export default function TabMenu({
  categories,
  activeCategoryId,
  onChange,
}: {
  categories: TourCategory[];
  activeCategoryId: string;
  onChange: (categoryId: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const items = [
    { _id: "all", title: "Всі тури", value: "all" },
    ...categories.map((category) => ({ ...category, value: category.title })),
  ];

  const handleClick = (item: (typeof items)[number]) => {
    onChange(item._id);
    if (pathname === "/tours") {
      const params = new URLSearchParams(window.location.search);
      params.set("category", item.value);
      params.delete("page");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <AnimatedWrapper
      as="ul"
      animation={fadeInAnimation({ y: 30, delay: 0.4 })}
      className="flex flex-col md:flex-row md:flex-wrap gap-y-[15px] gap-x-[14px] max-w-[325px] sm:max-w-[440px] md:max-w-full mx-auto md:mx-0"
    >
      {items.map((item) => (
        <TabMenuItem
          key={item._id}
          category={item}
          activeTab={activeCategoryId}
          onClick={() => handleClick(item)}
        />
      ))}
    </AnimatedWrapper>
  );
}
