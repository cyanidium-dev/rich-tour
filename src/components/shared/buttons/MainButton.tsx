import { ButtonProps } from "@/types/buttonProps";

export default function MainButton({
  children,
  className = "",
  variant = "red",
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden flex items-center justify-center py-[10px] px-[12.5px] text-10med xl:text-14med
         rounded-full border-[1.5px] border-main before:content-[""] before:absolute before:z-10 before:top-0 before:left-0 before:rounded-full 
         before:w-0 before:h-full before:duration-300 before:ease-in-out before:will-change-transform 
         xl:hover:before:w-full focus-visible:before:w-full transition duration-300 ease-in-out active:scale-95 ${
           variant === "red"
             ? "bg-main before:bg-white text-white xl:hover:text-main focus-visible:text-main"
             : "bg-white before:bg-main text-main xl:hover:text-white focus-visible:text-white"
         } ${className}`}
    >
      <span className="relative z-20"> {children}</span>
    </button>
  );
}
