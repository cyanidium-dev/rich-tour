import Container from "@/components/shared/container/Container";
import OffersListMob from "./OffersListMob";
import OffersTitle from "./OffersTitle";
import OffersListDesk from "./OffersListDesk";

export default function Offers() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <OffersTitle />
      <Container>
        <OffersListMob />
        <OffersListDesk />
      </Container>
    </section>
  );
}
