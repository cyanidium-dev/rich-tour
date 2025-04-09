interface TiktokIconProps {
  className?: string;
}

export default function TiktokIcon({ className = "" }: TiktokIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-label="tiktok icon"
      className={className}
    >
      <path
        d="M19.3664 6.79C18.569 5.87945 18.1296 4.7103 18.1297 3.5H14.5247V17.9667C14.4975 18.7497 14.1671 19.4916 13.6034 20.0357C13.0396 20.5799 12.2866 20.8838 11.503 20.8833C9.84636 20.8833 8.46969 19.53 8.46969 17.85C8.46969 15.8433 10.4064 14.3383 12.4014 14.9567V11.27C8.37636 10.7333 4.85303 13.86 4.85303 17.85C4.85303 21.735 8.07303 24.5 11.4914 24.5C15.1547 24.5 18.1297 21.525 18.1297 17.85V10.5117C19.5915 11.5615 21.3466 12.1248 23.1464 12.1217V8.51667C23.1464 8.51667 20.953 8.62167 19.3664 6.79Z"
        fill="currentColor"
      />
    </svg>
  );
}
