import Image from "next/image";
import InstagramIcon from "@/components/shared/icons/InstagramIcon";
import TelegramIcon from "@/components/shared/icons/TelegramIcon";
import TiktokIcon from "@/components/shared/icons/TiktokIcon";
import { TeamMember } from "@/types/team";

interface TeamCardProps {
  teamMember: TeamMember;
}

export default function TeamCard({ teamMember }: TeamCardProps) {
  const { photo, name, role, socials } = teamMember;
  const { instagram, telegram, tiktok } = socials;

  const socialList = [
    { link: instagram || "", icon: <InstagramIcon className="size-7" /> },
    { link: telegram || "", icon: <TelegramIcon /> },
    { link: tiktok || "", icon: <TiktokIcon /> },
  ];

  return (
    <div className="relative max-w-[325px] md:max-w-[226px] lg:max-w-[228px] xl:max-w-[265px] min-h-full bg-white rounded-[12px] shadow-card overflow-hidden">
      <div className="absolute top-0 left-0 w-full aspect-[325/346] md:aspect-[265/314]">
        <Image
          src={photo?.url}
          alt={photo?.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="relative z-10 py-[19px] mt-[319px] md:mt-[166px] lg:mt-[236px] xl:mt-[275px] bg-white rounded-t-[12px]">
        <h3 className="mb-[6px] text-20semi md:text-16semi lg:text-20semi text-center">
          {name}
        </h3>
        <p className="text-16semi md:text-12semi lg:text-16semi text-center text-main">
          {role}
        </p>
      </div>
      {!socialList || !socialList.length ? null : (
        <ul className="relative z-10 flex justify-center items-center gap-x-4 py-2 rounded-b-[12px] bg-main">
          {socialList.map((social, idx) => (
            <li key={idx}>
              <a
                href={social?.link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block size-7 text-white transition duration-300 ease-in-out active:text-black focus-visible:text-black
               xl:hover:text-black"
              >
                {social?.icon}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
