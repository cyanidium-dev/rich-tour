import MainButton from "../buttons/MainButton";
import LogoLink from "../logoLink/LogoLink";
import Container from "../container/Container";

export default function HeaderMob() {
  return (
    <Container className="flex xl:hidden items-center">
      <LogoLink className="w-[44px] xl:w-[75px] h-auto" />
      <MainButton>Вхід для агентів</MainButton>
    </Container>
  );
}
