import Link from "next/link";
import { MainButton } from "@/shared/ui";
import LogoLink from "@/components/shared/logoLink/LogoLink";
import { Container } from "@/shared/ui";
import NavMenu from "@/widgets/site-header/ui/navMenu/NavMenu";
import CurrencyRate from "@/widgets/site-header/ui/currencyRate/CurrencyRate";

interface HeaderDeskProps {
  isAuthenticated: boolean;
  role?: "agent" | "agency";
  showSmartTours: boolean;
}

export default function HeaderDesk({ isAuthenticated, role, showSmartTours }: HeaderDeskProps) {
  return (
    <Container className="hidden lg:flex items-center justify-between w-full py-5">
      <LogoLink className="w-[44px] xl:w-[75px] h-auto" />

      <div className="flex items-center gap-x-[15px]">
        <NavMenu showSmartTours={showSmartTours} />

        {isAuthenticated ? (
          <Link href={role === "agency" ? "/agency" : "/agent"}>
            <MainButton className="lg:text-10med xl:text-14med">Мій кабінет</MainButton>
          </Link>
        ) : (
          <Link href="/auth/sign-in">
            <MainButton className="lg:text-10med xl:text-14med">Вхід для агентів</MainButton>
          </Link>
        )}

        <CurrencyRate />
      </div>
    </Container>
  );
}
