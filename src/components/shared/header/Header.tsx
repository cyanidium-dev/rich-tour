import MainButton from "../buttons/MainButton";
import LogoLink from "../logoLink/LogoLink";
import Container from "../container/Container";
export default function Header() {
  return (
    <header className="fixed top-0 left-0 bg-white">
      <Container className="flex items-center">
        <LogoLink className="w-[44px] xl:w-[75px] h-auto" />
        <MainButton>Вхід для агентів</MainButton>
      </Container>
    </header>
  );
}
