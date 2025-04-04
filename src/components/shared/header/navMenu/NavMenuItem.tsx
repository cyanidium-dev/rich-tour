"use client";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

interface NavMenuItemProps {
  menuItem: { title: string; link: string };
  setIsHeaderMenuOpened?: Dispatch<SetStateAction<boolean>>;
}

export default function NavMenuItem({
  menuItem,
  setIsHeaderMenuOpened,
}: NavMenuItemProps) {
  const { title, link } = menuItem;

  return (
    <li
      onClick={() => {
        if (setIsHeaderMenuOpened) {
          setIsHeaderMenuOpened(false);
        }
      }}
    >
      <Link
        href={link}
        className="block pt-[26px] pb-[18px] xl:py-0 border-b border-black xl:border-none text-16reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
      >
        {title}
      </Link>
    </li>
  );
}
