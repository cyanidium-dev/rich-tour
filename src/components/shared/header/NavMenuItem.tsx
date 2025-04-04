import Link from "next/link";

interface NavMenuItemProps {
  menuItem: { title: string; link: string };
}

export default function NavMenuItem({ menuItem }: NavMenuItemProps) {
  const { title, link } = menuItem;

  return (
    <li>
      <Link
        href={link}
        className="text-16reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
      >
        {title}
      </Link>
    </li>
  );
}
