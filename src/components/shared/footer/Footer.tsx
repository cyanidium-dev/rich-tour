import Container from "../container/Container";
import LogoLink from "../logoLink/LogoLink";
import CallBack from "./CallBack";
import Contacts from "./Contacts";
import Map from "./Map";
import Schedule from "./Schedule";
import Socials from "./Socials";

export default function Footer() {
  return (
    <footer className="w-dvw bg-black">
      <Container className="pt-[64px] pb-20">
        <LogoLink className="w-[127px] h-auto mb-[58px] mx-auto text-white" />
        <Contacts />
        <Socials />
        <Schedule />
        <CallBack className="max-w-[246px] mx-auto" />
        <Map />
      </Container>
    </footer>
  );
}
