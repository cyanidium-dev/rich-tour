import MainButton from "../buttons/MainButton";
import LogoLink from "../logoLink/LogoLink";
import Container from "../container/Container";
import NavMenu from "./NavMenu";
import CurrencyRate from "./CurrencyRate";

export default function HeaderDesk() {
  return (
    <Container className="hidden xl:flex items-center justify-between w-full py-[39px]">
      <LogoLink className="w-[44px] xl:w-[75px] h-auto" />
      <div className="flex items-center gap-x-[15px]">
        <NavMenu />
        <MainButton>Вхід для агентів</MainButton>
        <CurrencyRate />
      </div>
    </Container>
  );
}
