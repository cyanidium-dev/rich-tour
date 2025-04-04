import { INSTAGRAM_URL, FACEBOOK_URL } from "@/constants/constants";
import InstagramIcon from "../icons/InstagramIcon";
import FacebookIcon from "../icons/FacebookIcon";
import SocialItem from "./SocialItem";

export default function Socials() {
  const socialList = [
    { link: INSTAGRAM_URL, icon: <InstagramIcon /> },
    { link: FACEBOOK_URL, icon: <FacebookIcon /> },
  ];
  return (
    <ul className="flex gap-x-[14px] items-center max-w-[246px] mx-auto my-8 text-white">
      {socialList.map((social, idx) => (
        <SocialItem key={idx} social={social} />
      ))}
    </ul>
  );
}
