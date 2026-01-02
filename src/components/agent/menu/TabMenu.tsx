import { Dispatch, SetStateAction } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import TabMenuItem from "./TabMenuItem";

interface TabMenuProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function TabMenu({ activeTab, setActiveTab }: TabMenuProps) {
  const router = useRouter();
  const pathName = usePathname();

  const menuList = [
    { title: "Мої замовлення", value: "orders" },
    { title: "Архів заявок", value: "archive" },
    { title: "Налаштування", value: "settings" },
    { title: "Змінити пароль", value: "change-password" },
    { title: "Вийти з профілю", value: "sign-out" },
  ];

  const handleTabClick = async (menu: { title: string; value: string }) => {
    if (menu.value === "sign-out") {
      try {
        await axios.post("/api/auth/logout", {}, { withCredentials: true });
      } finally {
        router.refresh();
        router.push("/");
      }
      return;
    }

    setActiveTab(menu.value);

    if (pathName === "/agent") {
      const params = new URLSearchParams(window.location.search);
      params.set("menu", menu.value);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  return (
      <AnimatedWrapper
          as="ul"
          animation={fadeInAnimation({ y: 30, delay: 0.4 })}
          className="flex gap-x-[14px] mb-10 xl:mb-[58px] pb-2 px-4 xs:px-[25px] md:pr-0 xl:pl-[80px] sm:max-w-[640px] md:max-w-full
      sm:mx-[calc((100vw-640px)/2)] md:mr-0 md:ml-[calc((100vw-768px)/2)] lg:ml-[calc((100vw-1024px)/2)] xl:ml-[calc((100vw-1280px)/2)]
       overflow-x-auto scrollbar scrollbar-h-[2.5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-transparent
       scrollbar-track-transparent menu-scroll"
      >
        {menuList.map((menuItem, idx) => (
            <TabMenuItem
                key={idx}
                menuItem={menuItem}
                activeTab={activeTab}
                handleTabClick={() => handleTabClick(menuItem)}
            />
        ))}
      </AnimatedWrapper>
  );
}
