import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import TabMenuItem from "./TabMenuItem";

interface TabMenuProps {
  activeTab: string;
  variant?: "agent" | "agency";
}

const agentMenuList = [
  { title: "Мої замовлення", value: "orders" },
  { title: "Архів заявок", value: "archive" },
  { title: "Налаштування", value: "settings" },
  { title: "Змінити пароль", value: "change-password" },
  { title: "Вийти з профілю", value: "sign-out" },
];

const agencyMenuList = [
  { title: "Усі замовлення", value: "orders" },
  { title: "Архів заявок", value: "archive" },
  { title: "Налаштування", value: "settings" },
  { title: "Змінити пароль", value: "change-password" },
  { title: "Вийти з профілю", value: "sign-out" },
];

export default function TabMenu({
  activeTab,
  variant = "agent",
}: TabMenuProps) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const menuList = variant === "agency" ? agencyMenuList : agentMenuList;

  const handleTabClick = async (menu: { title: string; value: string }) => {
    if (menu.value === "sign-out") {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } finally {
        window.location.href = "/";
      }
      return;
    }

    if (pathName === "/agent" || pathName === "/agency") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("menu", menu.value);
      params.delete("page");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <AnimatedWrapper
      as="ul"
      animation={fadeInAnimation({ y: 30, delay: 0.4 })}
      className="flex gap-x-[14px] mb-6 xl:mb-[40px] px-4 xs:px-[25px] md:pr-0 xl:pl-[80px] sm:max-w-[640px] md:max-w-full
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
