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
    role?: "agent" | "agency";
}

export default function HeaderMob({
                                      isAuthenticated,
                                      role,
                                  }: HeaderMobProps) {
    const [isHeaderMenuOpened, setIsHeaderMenuOpened] = useState(false);

    const toggleHeaderMenuOpen = () =>
        setIsHeaderMenuOpened((prev) => !prev);

    const cabinetHref =
        role === "agency" ? "/agency" : "/agent";

    return (
        <>
            <Container className="flex lg:hidden items-center justify-between py-4">
                <LogoLink className="w-[44px] xl:w-[75px] h-auto" />

                <div className="flex gap-x-2 items-center">
                    <CurrencyRate />

                    {isAuthenticated ? (
                        <Link href={cabinetHref}>
                            <MainButton className="text-10med xl:text-14med">
                                Мій кабінет
                            </MainButton>
                        </Link>
                    ) : (
                        <Link href="/auth/sign-in">
                            <MainButton className="text-10med xl:text-14med">
                                Вхід для агентів
                            </MainButton>
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
            />
        </>
    );
}
