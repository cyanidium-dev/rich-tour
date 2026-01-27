"use client";

import SearchIcon from "@/components/shared/icons/SearchIcon";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export default function SearchInput({
                                        value,
                                        onChange,
                                        placeholder = "Пошук",
                                        className = "",
                                        disabled = false,
                                    }: SearchInputProps) {
    return (
        <div
            className={`relative w-full ${className}`}
        >
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="
          w-full h-12
          rounded-full
          border border-black
          bg-white
          px-5 pr-12
          text-black text-14reg
          placeholder:text-black/60
          outline-none
          focus:ring-0
          disabled:opacity-60 disabled:cursor-not-allowed
        "
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <SearchIcon />
      </span>
        </div>
    );
}
