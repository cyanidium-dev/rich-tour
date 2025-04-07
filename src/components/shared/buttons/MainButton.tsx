import { Dispatch, ReactNode, SetStateAction } from "react";

export interface MainButtonProps {
  children: string | ReactNode;
  className?: string;
  type?: "submit" | "button";
  variant?: "ghost white" | "ghost red" | "red" | "white";
  onClick?: () => void | Dispatch<SetStateAction<boolean>>;
}

export default function MainButton({
  children,
  type = "button",
  className = "",
  variant = "red",
  onClick,
}: MainButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative overflow-hidden flex items-center justify-center py-[10px] xl:py-[14px] px-[14.5px] text-10med xl:text-14med
         rounded-full border-[1.5px] before:content-[""] before:absolute before:z-10 before:top-0 before:left-0 before:rounded-full 
         before:w-0 before:h-full before:duration-700 before:ease-in-out before:will-change-transform 
         xl:hover:before:w-full focus-visible:before:w-full transition duration-300 ease-in-out active:scale-95 ${
           variant === "red"
             ? "border-main bg-main before:bg-white text-white xl:hover:text-main focus-visible:text-main"
             : variant === "ghost red"
             ? "border-main bg-white before:bg-main text-main xl:hover:text-white focus-visible:text-white"
             : variant === "ghost white"
             ? "border-white bg-transparent before:bg-white text-white xl:hover:text-black focus-visible:text-black"
             : "border-white bg-white text-main before:bg-main xl:hover:text-white focus-visible:text-white"
         } ${className}`}
    >
      <span className="relative z-20"> {children}</span>
    </button>
  );
}
