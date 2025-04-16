import { useEffect, useRef } from "react";

interface TabMenuItemProps {
  menuItem: { title: string; value: string };
  activeTab: string;
  onClick: () => void;
}

export default function TabMenuItem({
  menuItem,
  activeTab,
  onClick,
}: TabMenuItemProps) {
  const { title, value } = menuItem;

  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (value === activeTab && itemRef.current) {
      const item = itemRef.current;
      const itemRect = item.getBoundingClientRect();
      const container = item.parentElement; // Отримуємо контейнер <ul>
      const containerRect = container?.getBoundingClientRect();

      if (containerRect) {
        // Перевіряємо, чи елемент повністю видимий у контейнері
        if (
          itemRect.left < containerRect.left ||
          itemRect.right > containerRect.right
        ) {
          // Якщо не видимий, прокручуємо до нього
          item.scrollIntoView({
            inline: "center",
            block: "nearest",
          });
        }
      }
    }
  }, [value, activeTab]);

  return (
    <li ref={itemRef}>
      <button
        onClick={onClick}
        className={`flex items-center justify-center h-12 px-12 text-14med rounded-full border text-nowrap ${
          activeTab === value
            ? "border-main bg-main text-white"
            : "border-black bg-white text-black"
        } xl:hover:text-white xl:hover:bg-main xl:hover:brightness-[135%] xl:hover:border-main focus-visible:text-white 
        focus-visible:bg-main focus-visible:brightness-[135%] focus-visible:border-main transition duration-300 ease-in-out`}
      >
        {title}
      </button>
    </li>
  );
}
