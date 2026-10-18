import type { SiteContacts } from "@/shared/config";
import InstagramIcon from "@/components/shared/icons/InstagramIcon";
import FacebookIcon from "@/components/shared/icons/FacebookIcon";
import SocialItem from "@/widgets/site-footer/ui/SocialItem";

interface SocialsProps {
  contacts: SiteContacts | null;
  className?: string;
}

export default function Socials({ contacts, className }: SocialsProps) {
  if (!contacts?.instagram && !contacts?.facebook) {
    return null;
  }

  const { instagram, facebook } = contacts;

  const socialList = [
    { link: instagram || "", icon: <InstagramIcon /> },
    { link: facebook || "", icon: <FacebookIcon /> },
  ];

  return (
    <ul className={`flex gap-x-[14px] items-center  ${className}`}>
      {socialList
        .filter((social) => social.link)
        .map((social, idx) => (
          <SocialItem key={idx} social={social} />
        ))}
    </ul>
  );
}
