import { ReactNode } from "react";

interface SocialItemProps {
  social: { link: string; icon: ReactNode };
}

export default function SocialItem({ social }: SocialItemProps) {
  const { link, icon } = social;

  return (
    <li>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="text-white transition duration-300 ease-in-out active:text-main focus-visible:text-main
         xl:hover:text-main"
      >
        {icon}
      </a>
    </li>
  );
}
