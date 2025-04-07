interface ArrowInCircleIconProps {
  className?: string;
  isShownMore?: boolean;
}

export default function ArrowInCircleIcon({
  className,
  isShownMore,
}: ArrowInCircleIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      aria-label="arrow in the circle icon"
      className={className}
    >
      <path
        d="M19.0001 34.8337C27.7446 34.8337 34.8334 27.7448 34.8334 19.0003C34.8334 10.2558 27.7446 3.16699 19.0001 3.16699C10.2556 3.16699 3.16675 10.2558 3.16675 19.0003C3.16675 27.7448 10.2556 34.8337 19.0001 34.8337Z"
        stroke="currentColor"
        strokeWidth="2.375"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g
        className={`transform transition-transform duration-500 ease-in-out origin-center ${
          isShownMore ? "rotate-90" : "rotate-0"
        }`}
      >
        <path
          d="M17.0049 24.5885L22.5782 18.9993L17.0049 13.4102"
          stroke="currentColor"
          strokeWidth="2.375"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
