import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/shared/ui";
import NavMenu from "@/widgets/site-header/ui/navMenu/NavMenu";
import AnimatedArrow from "@/widgets/site-header/ui/AnimatedArrow";

const burgerMenuVariants = {
  hidden: { x: 0, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: {
    x: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.42, 0, 1, 1] as const },
  },
};

interface BurgerMenuProps {
  isHeaderMenuOpened: boolean;
  setIsHeaderMenuOpened: Dispatch<SetStateAction<boolean>>;
  showSmartTours: boolean;
}

export default function BurgerMenu({
  isHeaderMenuOpened,
  setIsHeaderMenuOpened,
  showSmartTours,
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
            <NavMenu
              setIsHeaderMenuOpened={setIsHeaderMenuOpened}
              isAnimated
              showSmartTours={showSmartTours}
            />
            <AnimatedArrow />
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
