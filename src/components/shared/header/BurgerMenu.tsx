import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "../container/Container";
import NavMenu from "./navMenu/NavMenu";
import AnimatedArrow from "./AnimatedArrow";

const burgerMenuVariants = {
  hidden: { x: 0, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: {
    x: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
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
          } lg:hidden absolute z-50 top-[68px] right-0 w-[100vw] h-[calc(100dvh-68px)] py-4 sm:py-10 bg-white
       overflow-y-auto`}
        >
          <Container>
            <NavMenu setIsHeaderMenuOpened={setIsHeaderMenuOpened} isAnimated />
            <AnimatedArrow />
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
