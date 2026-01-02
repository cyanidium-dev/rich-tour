"use client";

import Link from "next/link";
import MainButton from "../buttons/MainButton";
import LogoLink from "../logoLink/LogoLink";
import Container from "../container/Container";
import NavMenu from "./navMenu/NavMenu";
import CurrencyRate from "./currencyRate/CurrencyRate";

interface HeaderDeskProps {
    isAuthenticated: boolean;
    role?: "agent" | "agency";
}

export default function HeaderDesk({
                                       isAuthenticated,
                                       role,
                                   }: HeaderDeskProps) {
    return (
        <Container className="hidden lg:flex items-center justify-between w-full py-5">
            <LogoLink className="w-[44px] xl:w-[75px] h-auto" />

            <div className="flex items-center gap-x-[15px]">
                <NavMenu />

                {isAuthenticated ? (
                    <Link href={role === "agency" ? "/agency" : "/agent"}>
                        <MainButton className="lg:text-10med xl:text-14med">
                            Мій кабінет
                        </MainButton>
                    </Link>
                ) : (
                    <Link href="/auth/sign-in">
                        <MainButton className="lg:text-10med xl:text-14med">
                            Вхід для агентів
                        </MainButton>
                    </Link>
                )}

                <CurrencyRate />
            </div>
        </Container>
    );
}
