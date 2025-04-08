interface SelectIconProps {
  className?: string;
}

export default function SelectIcon({ className }: SelectIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      aria-label="select icon"
      className={className}
    >
      <path
        d="M17.0999 7.4585L11.6666 12.8918C11.0249 13.5335 9.9749 13.5335 9.33324 12.8918L3.8999 7.4585"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
