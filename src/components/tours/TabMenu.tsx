"use client";
import { Dispatch, SetStateAction } from "react";
import { usePathname, useRouter } from "next/navigation";
// import { categories } from "../home/promotion/mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import TabMenuItem from "./TabMenuItem";
import { Category } from "@/types/category";

interface TabMenuProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

//@ts-expect-error
export default function TabMenu({ categories, activeTab, setActiveTab }: TabMenuProps) {
  const router = useRouter();
  const pathName = usePathname();

  if (!categories || !categories?.length) return null;

  //@ts-expect-error
  const categoriesList = [{ title: "Всі тури", value: "all" }, ...categories.map(item => ({...item, value: item.title}))];

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
    <AnimatedWrapper
      as="ul"
      animation={fadeInAnimation({ y: 30, delay: 0.4 })}
      className="flex flex-col md:flex-row md:flex-wrap gap-y-[15px] gap-x-[14px] max-w-[325px] sm:max-w-[440px] md:max-w-full mx-auto md:mx-0"
    >
      {categoriesList.map((category, idx) => (
        <TabMenuItem
          key={idx}
          category={category}
          activeTab={activeTab}
          onClick={() => handleTabClick(category)}
        />
      ))}
    </AnimatedWrapper>
  );
}
