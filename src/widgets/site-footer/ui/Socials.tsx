import { socials } from "@/shared/config";
import InstagramIcon from "@/components/shared/icons/InstagramIcon";
import FacebookIcon from "@/components/shared/icons/FacebookIcon";
import SocialItem from "@/widgets/site-footer/ui/SocialItem";

interface SocialsProps {
  className?: string;
}

export default function Socials({ className }: SocialsProps) {
  if (!socials) {
    return null;
  }

  const { instagram, facebook } = socials;

  const socialList = [
    { link: instagram || "", icon: <InstagramIcon /> },
    { link: facebook || "", icon: <FacebookIcon /> },
  ];

  return (
    <ul className={`flex gap-x-[14px] items-center  ${className}`}>
      {socialList.map((social, idx) => (
        <SocialItem key={idx} social={social} />
      ))}
    </ul>
  );
}
