"use client";

import { motion } from "framer-motion";

export default function AnimatedScribbleArrow() {
    return (
        <motion.svg
            width="72"
            height="78"
            viewBox="0 0 72 78"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[72px] h-auto absolute bottom-[-75px] lg:bottom-auto right-0 lg:right-auto lg:left-[445px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
        >
            <motion.path
                d="M63.9187 18.9357C62.5351 18.0216 57.2714 19.7506 54.9339 22.2811C51.8172 25.655 51.6787 25.9157 49.2558 29.6759C46.8329 33.436 47.659 38.5818 48.5443 42.2063C48.8667 43.5262 49.379 46.0174 50.4734 46.7947C51.0165 47.1803 51.5799 45.3532 51.5902 45.0089C51.6899 41.6862 49.4236 38.7781 46.0871 39.0534C43.0598 39.3031 40.6551 42.3279 38.9331 44.9821C35.4969 50.2784 36.926 56.7191 39.1733 61.2258C39.5633 62.0077 42.7751 67.7089 44.0623 66.1383C45.2135 64.7337 44.8686 62.4785 44.3733 61.1181C43.8007 59.5453 41.4955 58.1264 39.978 57.7808C37.3612 57.185 34.5043 59.4483 32.8897 61.8921C30.8741 64.943 30.6493 68.9905 30.991 72.2107C31.322 75.3304 32.581 75.0138 33.8896 72.0865C35.38 68.7528 31.6125 65.5465 30.1334 63.487C23.9132 54.8255 17.3156 47.1638 8.82564 41.0482"
                stroke="#E43A3A"
                strokeWidth="3"
                strokeLinecap="round"
                variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: { pathLength: 1, opacity: 1 },
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />

            <motion.path
                d="M18.025 40.0021C16.7772 39.6304 16.9071 39.7163 13.91 39.8467C12.491 39.8282 11.0263 40.233 9.59767 40.2976C9.44574 40.3045 8.48815 40.4079 8.4989 40.5092C8.5183 40.6921 8.72821 40.9547 8.79017 41.1051C9.17946 42.0501 9.5159 43.0308 9.84584 44.0099C10.7065 46.5637 11.3226 49.251 12.0484 51.8734"
                stroke="#E43A3A"
                strokeWidth="3"
                strokeLinecap="round"
                variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: { pathLength: 1, opacity: 1 },
                }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 1.8 }}
            />
        </motion.svg>
    );
}
