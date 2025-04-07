import { Dispatch, SetStateAction } from "react";
import NavMenuItem from "./NavMenuItem";

interface NavMenuProps {
  setIsHeaderMenuOpened?: Dispatch<SetStateAction<boolean>>;
}

const navMenuList = [
  { title: "Тури", link: "/tours" },
  { title: "Про нас", link: "/about" },
  { title: "SMART-тури", link: "/#smart-tours" },
  { title: "Корпоративне обслуговування", link: "/corporate" },
  { title: "STEP", link: "/#step" },
  { title: "Контакти", link: "/contacts" },
];

export default function NavMenu({ setIsHeaderMenuOpened }: NavMenuProps) {
  return (
    <ul className="flex flex-col xl:flex-row gap-x-4">
      {navMenuList.map((menuItem, idx) => (
        <NavMenuItem
          key={idx}
          menuItem={menuItem}
          setIsHeaderMenuOpened={setIsHeaderMenuOpened}
        />
      ))}
    </ul>
  );
}
