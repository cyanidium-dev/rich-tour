import { Dispatch, SetStateAction } from "react";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import NavMenuItem from "./NavMenuItem";

interface NavMenuProps {
  setIsHeaderMenuOpened?: Dispatch<SetStateAction<boolean>>;
  isAnimated?: boolean;
}

const navMenuList = [
  { title: "Тури", link: "/tours" },
  { title: "Про нас", link: "/about" },
  { title: "SMART-тури", link: "/#smart-tours" },
  { title: "Корпоративне обслуговування", link: "/corporate" },
  { title: "STEP", link: "/#faq" },
  { title: "Контакти", link: "/contacts" },
];

export default function NavMenu({
  setIsHeaderMenuOpened,
  isAnimated = false,
}: NavMenuProps) {
  return (
    <AnimatedWrapper
      as="ul"
      animation={
        isAnimated
          ? listVariants({ staggerChildren: 0.2, delayChildren: 0.15 })
          : undefined
      }
      className="flex flex-col lg:flex-row gap-x-4"
    >
      {navMenuList.map((menuItem, idx) => (
        <NavMenuItem
          key={idx}
          menuItem={menuItem}
          isAnimated={isAnimated}
          setIsHeaderMenuOpened={setIsHeaderMenuOpened}
        />
      ))}
    </AnimatedWrapper>
  );
}
