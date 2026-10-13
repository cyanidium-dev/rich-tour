"use client";

import { useState } from "react";
import Link from "next/link";
import { MainButton } from "@/shared/ui";
import LogoLink from "@/components/shared/logoLink/LogoLink";
import { Container } from "@/shared/ui";
import CurrencyRate from "@/widgets/site-header/ui/currencyRate/CurrencyRate";
import BurgerMenuButton from "@/widgets/site-header/ui/BurgerMenuButton";
import BurgerMenu from "@/widgets/site-header/ui/BurgerMenu";

interface HeaderMobProps {
  isAuthenticated: boolean;
  role?: "agent" | "agency";
  showSmartTours: boolean;
}

export default function HeaderMob({ isAuthenticated, role, showSmartTours }: HeaderMobProps) {
  const [isHeaderMenuOpened, setIsHeaderMenuOpened] = useState(false);

  const toggleHeaderMenuOpen = () => setIsHeaderMenuOpened((prev) => !prev);

  const cabinetHref = role === "agency" ? "/agency" : "/agent";

  return (
    <>
      <Container className="flex lg:hidden items-center justify-between py-4">
        <LogoLink className="w-[44px] xl:w-[75px] h-auto" />

        <div className="flex gap-x-2 items-center">
          <CurrencyRate />

          {isAuthenticated ? (
            <Link href={cabinetHref}>
              <MainButton className="text-10med xl:text-14med">Мій кабінет</MainButton>
            </Link>
          ) : (
            <Link href="/auth/sign-in">
              <MainButton className="text-10med xl:text-14med">Вхід для агентів</MainButton>
            </Link>
          )}

          <BurgerMenuButton
            isHeaderMenuOpened={isHeaderMenuOpened}
            toggleHeaderMenuOpen={toggleHeaderMenuOpen}
          />
        </div>
      </Container>

      <BurgerMenu
        isHeaderMenuOpened={isHeaderMenuOpened}
        setIsHeaderMenuOpened={setIsHeaderMenuOpened}
        showSmartTours={showSmartTours}
      />
    </>
  );
}
