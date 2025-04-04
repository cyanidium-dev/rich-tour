import FormButton from "../buttons/FormButton";
import Container from "../container/Container";
import LogoLink from "../logoLink/LogoLink";
import Contacts from "./Contacts";
import Map from "./Map";
import Schedule from "./Schedule";
import Socails from "./Socails";

export default function Footer() {
  return (
    <footer className="w-dvw bg-black">
      <Container className="pt-[64px] pb-20">
        <LogoLink className="w-[127px] h-auto mb-[58px] mx-auto text-white" />
        <Contacts />
        <Socails />
        <Schedule />
        <FormButton className="w-full max-w-[246px]">Відправити</FormButton>
        <Map />
      </Container>
    </footer>
  );
}
