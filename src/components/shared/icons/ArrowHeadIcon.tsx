interface ArrowHeadIconProps {
  className?: string;
}

export default function ArrowHeadIcon({ className = "" }: ArrowHeadIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="23"
      viewBox="0 0 14 23"
      fill="none"
      aria-label="arrow head icon"
      className={className}
    >
      <path
        d="M0.926025 10.4393C0.340225 11.0251 0.340225 11.9749 0.926025 12.5607L10.472 22.1066C11.0578 22.6924 12.0075 22.6924 12.5933 22.1066C13.1791 21.5208 13.1791 20.5711 12.5933 19.9853L4.108 11.5L12.5933 3.01472C13.1791 2.42893 13.1791 1.47919 12.5933 0.893398C12.0075 0.307611 11.0578 0.307611 10.472 0.893398L0.926025 10.4393Z"
        fill="currentColor"
      />
    </svg>
  );
}
