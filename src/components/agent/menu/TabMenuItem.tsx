import { useEffect, useRef } from "react";

interface TabMenuItemProps {
  menuItem: { title: string; value: string };
  activeTab: string;
  handleTabClick: () => void;
}

export default function TabMenuItem({
                                      menuItem,
                                      activeTab,
                                      handleTabClick,
                                    }: TabMenuItemProps) {
  const { title, value } = menuItem;
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (value === activeTab && itemRef.current) {
      const item = itemRef.current;
      const itemRect = item.getBoundingClientRect();
      const container = item.parentElement;
      const containerRect = container?.getBoundingClientRect();

      if (
          containerRect &&
          (itemRect.left < containerRect.left ||
              itemRect.right > containerRect.right)
      ) {
        item.scrollIntoView({
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [value, activeTab]);

  return (
      <li ref={itemRef}>
        <button
            onClick={handleTabClick}
            className={`flex items-center justify-center h-12 px-12 text-14med rounded-full border text-nowrap ${
                activeTab === value
                    ? "border-main bg-main text-white"
                    : `bg-white ${
                        value === "sign-out"
                            ? "border-main text-main"
                            : "border-black text-black"
                    }`
            } xl:hover:text-white xl:hover:bg-main xl:hover:brightness-[135%]
        xl:hover:border-main focus-visible:text-white focus-visible:bg-main
        focus-visible:brightness-[135%] focus-visible:border-main
        transition duration-300 ease-in-out`}
        >
          {title}
        </button>
      </li>
  );
}
