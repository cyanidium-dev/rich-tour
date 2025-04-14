import Link from "next/link";
import MainButton from "../buttons/MainButton";
import LogoLink from "../logoLink/LogoLink";
import Container from "../container/Container";
import NavMenu from "./navMenu/NavMenu";
import CurrencyRate from "./currencyRate/CurrencyRate";

interface HeaderDeskProps {
  isAuthenticated: boolean;
}

export default function HeaderDesk({ isAuthenticated }: HeaderDeskProps) {
  return (
    <Container className="hidden lg:flex items-center justify-between w-full py-5">
      <LogoLink className="w-[44px] xl:w-[75px] h-auto" />
      <div className="flex items-center gap-x-[15px]">
        <NavMenu />
        <Link href="/auth/sign-in">
          <MainButton className="lg:text-10med xl:text-14med">
            {isAuthenticated ? "Мій кабінет" : "Вхід для агентів"}
          </MainButton>
        </Link>
        <CurrencyRate />
      </div>
    </Container>
  );
}
