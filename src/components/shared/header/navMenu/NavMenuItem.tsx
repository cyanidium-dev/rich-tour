"use client";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { listItemVariants } from "../../animation/animationVariants";

interface NavMenuItemProps {
  menuItem: { title: string; link: string };
  setIsHeaderMenuOpened?: Dispatch<SetStateAction<boolean>>;
  isAnimated?: boolean;
}

export default function NavMenuItem({
  menuItem,
  setIsHeaderMenuOpened,
  isAnimated = false,
}: NavMenuItemProps) {
  const { title, link } = menuItem;

  return (
    <motion.li
      variants={isAnimated ? listItemVariants : {}}
      viewport={{ once: true, amount: 0.2 }}
      onClick={() => {
        if (setIsHeaderMenuOpened) {
          setIsHeaderMenuOpened(false);
        }
      }}
    >
      <Link
        href={link}
        className="block pt-[26px] pb-[18px] lg:py-0 border-b border-black lg:border-none text-16reg lg:text-14reg xl:text-16reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
      >
        {title}
      </Link>
    </motion.li>
  );
}
