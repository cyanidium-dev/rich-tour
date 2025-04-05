"use client";
import { useState } from "react";
import MainButton from "../buttons/MainButton";
import LogoLink from "../logoLink/LogoLink";
import Container from "../container/Container";
import CurrencyRate from "./currencyRate/CurrencyRate";
import BurgerMenuButton from "./BurgerMenuButton";
import BurgerMenu from "./BurgerMenu";

export default function HeaderMob() {
  const [isHeaderMenuOpened, setIsHeaderMenuOpened] = useState(false);
  const toggleHeaderMenuOpen = () => setIsHeaderMenuOpened(!isHeaderMenuOpened);

  return (
    <>
      <Container className="flex xl:hidden items-center justify-between py-4">
        <LogoLink className="w-[44px] xl:w-[75px] h-auto" />
        <div className="flex gap-x-2">
          <CurrencyRate />
          <MainButton className="text-10med xl:text-14med">
            Вхід для агентів
          </MainButton>
          <BurgerMenuButton
            isHeaderMenuOpened={isHeaderMenuOpened}
            toggleHeaderMenuOpen={toggleHeaderMenuOpen}
          />
        </div>
      </Container>
      <BurgerMenu
        isHeaderMenuOpened={isHeaderMenuOpened}
        setIsHeaderMenuOpened={setIsHeaderMenuOpened}
      />
    </>
  );
}
