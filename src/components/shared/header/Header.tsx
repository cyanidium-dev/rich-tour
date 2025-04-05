import HeaderMob from "./HeaderMob";
import HeaderDesk from "./HeaderDesk";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-dvw bg-white">
      <HeaderMob />
      <HeaderDesk />
    </header>
  );
}
