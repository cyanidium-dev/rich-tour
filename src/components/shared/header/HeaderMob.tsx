"use client";
import { useState } from "react";
import Link from "next/link";
import MainButton from "../buttons/MainButton";
import LogoLink from "../logoLink/LogoLink";
import Container from "../container/Container";
import CurrencyRate from "./currencyRate/CurrencyRate";
import BurgerMenuButton from "./BurgerMenuButton";
import BurgerMenu from "./BurgerMenu";

interface HeaderMobProps {
  isAuthenticated: boolean;
}

export default function HeaderMob({ isAuthenticated }: HeaderMobProps) {
  const [isHeaderMenuOpened, setIsHeaderMenuOpened] = useState(false);
  const toggleHeaderMenuOpen = () => setIsHeaderMenuOpened(!isHeaderMenuOpened);

  return (
    <>
      <Container className="flex lg:hidden items-center justify-between py-4">
        <LogoLink className="w-[44px] xl:w-[75px] h-auto" />
        <div className="flex gap-x-2">
          <CurrencyRate />
          <Link href="/auth/sign-in">
            <MainButton className="text-10med xl:text-14med">
              {isAuthenticated ? "Мій кабінет" : "Вхід для агентів"}
            </MainButton>
          </Link>

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
