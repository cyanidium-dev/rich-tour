import { Container } from "@/shared/ui";
import LogoLink from "@/components/shared/logoLink/LogoLink";
import CallBack from "@/widgets/site-footer/ui/CallBack";
import Contacts from "@/widgets/site-footer/ui/Contacts";
import Map from "@/widgets/site-footer/ui/Map";
import Schedule from "@/widgets/site-footer/ui/Schedule";
import Socials from "./Socials";
import FooterAnimation from "@/widgets/site-footer/ui/FooterAnimation";

export default function Footer() {
  return (
    <footer className="w-dvw bg-black overflow-hidden">
      <FooterAnimation>
        <Container className="xl:flex gap-x-[128px] pt-[64px] pb-20">
          <div className="xl:my-auto">
            <LogoLink className="w-[127px] h-auto mb-[58px] mx-auto text-white" />
          </div>
          <div className="w-full md:flex gap-x-5 xl:gap-x-[68px] justify-between">
            <div className="md:w-[calc(33.3%-13.3px)] xl:w-[calc(33.3%-35.3px)]">
              <Contacts />
              <Socials className="text-white max-w-[246px] mx-auto my-8" />
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
      </FooterAnimation>
    </footer>
  );
}
