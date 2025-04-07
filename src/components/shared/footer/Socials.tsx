import { socials } from "./mockedData";
import InstagramIcon from "../icons/InstagramIcon";
import FacebookIcon from "../icons/FacebookIcon";
import SocialItem from "./SocialItem";

export default function Socials() {
  if (!socials) {
    return null;
  }

  const { instagram, facebook } = socials;

  const socialList = [
    { link: instagram || "", icon: <InstagramIcon /> },
    { link: facebook || "", icon: <FacebookIcon /> },
  ];

  return (
    <ul className="flex gap-x-[14px] items-center max-w-[246px] mx-auto my-8 text-white">
      {socialList.map((social, idx) => (
        <SocialItem key={idx} social={social} />
      ))}
    </ul>
  );
}
