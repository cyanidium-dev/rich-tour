import NavMenuItem from "./NavMenuItem";

const navMenuList = [
  { title: "Тури", link: "/tours" },
  { title: "Про нас", link: "/about" },
  { title: "SMART-тури", link: "/#smart-tours" },
  { title: "Корпоративне обслуговування", link: "/corporate" },
  { title: "STEP", link: "/#step" },
  { title: "Контакти", link: "/contacts" },
  { title: "Відгуки", link: "/reviews" },
];

export default function NavMenu() {
  return (
    <ul className="flex gap-x-4">
      {navMenuList.map((menuItem, idx) => (
        <NavMenuItem key={idx} menuItem={menuItem} />
      ))}
    </ul>
  );
}
