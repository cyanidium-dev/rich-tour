interface CloseHotelModalIconProps {
    className?: string;
}

export default function CloseHotelModalIcon({
                                              className,
                                          }: CloseHotelModalIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            fill="none"
            className={className}
        >
            <path
                fill="#02170C"
                d="m17.36 2.275-6.6 6.6 6.6 6.599a1.337 1.337 0 0 1 0 1.886 1.337 1.337 0 0 1-1.886 0l-6.6-6.6-6.6 6.6a1.337 1.337 0 0 1-1.885 0 1.337 1.337 0 0 1 0-1.886l6.6-6.6-6.6-6.6a1.337 1.337 0 0 1 0-1.885 1.337 1.337 0 0 1 1.886 0l6.6 6.6 6.599-6.6a1.337 1.337 0 0 1 1.886 0 1.337 1.337 0 0 1 0 1.886Z"
            />
        </svg>
    );
}
