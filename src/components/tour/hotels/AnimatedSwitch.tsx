"use client";

import { ElementType, PropsWithChildren, useMemo } from "react";
import { motion, Variants } from "framer-motion";

interface AnimatedSwitchProps extends PropsWithChildren {
    as?: ElementType;
    className?: string;
    animation?: Variants;
}

const defaultSwap: Variants = {
    hidden: { opacity: 0, scale: 1.02 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.99 },
};

export default function AnimatedSwitch({
                                           as: Component = "div",
                                           className = "",
                                           animation = defaultSwap,
                                           children,
                                       }: AnimatedSwitchProps) {
    const MotionComponent = useMemo(() => motion.create(Component), [Component]);

    return (
        <MotionComponent
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={animation}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={className}
        >
            {children}
        </MotionComponent>
    );
}
