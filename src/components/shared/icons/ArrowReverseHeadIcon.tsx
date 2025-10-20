interface ArrowHeadIconProps {
  className?: string;
}


export default function ArrowReverseHeadIcon({className = ""}: ArrowHeadIconProps) {
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
            d="M13.074 12.5607C13.6598 11.9749 13.6598 11.0251 13.074 10.4393L3.528 0.893398C2.9422 0.307611 1.99245 0.307611 1.40666 0.893398C0.820868 1.47919 0.820868 2.42893 1.40666 3.01472L9.892 11.5L1.40666 19.9853C0.820868 20.5711 0.820868 21.5208 1.40666 22.1066C1.99245 22.6924 2.9422 22.6924 3.528 22.1066L13.074 12.5607Z"
            fill="currentColor"
        />
      </svg>

  );
}
