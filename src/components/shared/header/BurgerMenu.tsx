import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "../container/Container";
import NavMenu from "./navMenu/NavMenu";
import Image from "next/image";

const burgerMenuVariants = {
  hidden: { x: 0, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  exit: {
    x: 0,
    opacity: 0,
    transition: { duration: 0.6, ease: "easeIn" },
  },
};

interface BurgerMenuProps {
  isHeaderMenuOpened: boolean;
  setIsHeaderMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function BurgerMenu({
  isHeaderMenuOpened,
  setIsHeaderMenuOpened,
}: BurgerMenuProps) {
  return (
    <AnimatePresence>
      {isHeaderMenuOpened && (
        <motion.div
          viewport={{ once: true, amount: 0.2 }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={burgerMenuVariants}
          className={`${
            isHeaderMenuOpened ? "no-doc-scroll" : ""
          } xl:hidden absolute z-50 top-[68px] right-0 w-[100vw] h-[calc(100dvh-68px)] pt-2 pb-4 sm:py-10 bg-white
       overflow-y-auto`}
        >
          <Container>
            <NavMenu setIsHeaderMenuOpened={setIsHeaderMenuOpened} />
            <Image
              src="/images/header/arrow.svg"
              alt="arrow"
              width="185"
              height="164"
              className="w-[140px] sm:w-[161px] h-auto mt-6 sm:mt-20 ml-[13%]"
            />
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
