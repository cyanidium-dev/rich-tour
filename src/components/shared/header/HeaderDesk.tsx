import MainButton from "../buttons/MainButton";
import LogoLink from "../logoLink/LogoLink";
import Container from "../container/Container";
import NavMenu from "./navMenu/NavMenu";
import CurrencyRate from "./currencyRate/CurrencyRate";

export default function HeaderDesk() {
  return (
    <Container className="hidden lg:flex items-center justify-between w-full py-5">
      <LogoLink className="w-[44px] xl:w-[75px] h-auto" />
      <div className="flex items-center gap-x-[15px]">
        <NavMenu />
        <MainButton className="lg:text-10med xl:text-14med">
          Вхід для агентів
        </MainButton>
        <CurrencyRate />
      </div>
    </Container>
  );
}
