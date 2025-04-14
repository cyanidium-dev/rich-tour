import Container from "../shared/container/Container";
import TabMenu from "./TabMenu";

export default function Tours() {
  return (
    <section className="pt-[33px] mb-[148px] xl:mb-[180px]">
      <Container>
        <h1 className="mb-10 text-36med xl:text-48med text-center">Тури</h1>
        <TabMenu />
      </Container>
    </section>
  );
}
