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
      <Container className="xl:flex gap-x-[128px] pt-[64px] pb-20">
        <div className="xl:my-auto">
          <LogoLink className="w-[127px] h-auto mb-[58px] mx-auto text-white" />
        </div>
        <div className="w-full md:flex gap-x-5 xl:gap-x-[68px] justify-between">
          <div className="md:w-[calc(33.3%-13.3px)] xl:w-[calc(33.3%-35.3px)]">
            <Contacts />
            <Socials />
          </div>
          <div className="md:w-[calc(33.3%-13.3px)] xl:w-[calc(33.3%-63.3px)]">
            <Schedule />
            <CallBack className="max-w-[246px] mx-auto md:mx-0" />
          </div>
          <div className="md:w-[calc(33.3%-13.3px)] xl:w-[calc(33.3%-17.3px)]">
            <Map />
          </div>
        </div>
      </Container>
    </footer>
  );
}
