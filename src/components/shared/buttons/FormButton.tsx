import { Dispatch, ReactNode, SetStateAction } from "react";
import IconLoader from "../icons/IconLoader";

export interface FormButtonProps {
  children: string | ReactNode;
  className?: string;
  type?: "submit" | "button";
  variant?: "red" | "black";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void | Dispatch<SetStateAction<boolean>>;
}

export default function FormButton({
  children,
  className = "",
  variant = "red",
  disabled = false,
  isLoading = false,
  onClick,
}: FormButtonProps) {
  console.log(children);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex justify-center items-center px-4 py-[13px] rounded-[6px] text-12semi text-white disabled:opacity-50 enabled:xl:hover:brightness-[115%] 
        enabled:focus-visible:brightness-[115%] transition duration-300 ease-in-out ${
          variant === "red" ? "bg-main" : "bg-black"
        } ${className}`}
    >
      {children}
      {isLoading ? <IconLoader /> : ""}
    </button>
  );
}
