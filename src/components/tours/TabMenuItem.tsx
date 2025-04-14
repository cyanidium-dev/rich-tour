import { Category } from "@/types/categories";

interface TabMenuItemProps {
  category: Category;
  activeTab: string;
  onClick: () => void;
}

export default function TabMenuItem({
  category,
  activeTab,
  onClick,
}: TabMenuItemProps) {
  const { title, value } = category;

  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center justify-center w-full md:w-fit px-4 sm:px-[27px] py-[14px] text-14med rounded-full border  ${
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
