import Container from "@/components/shared/container/Container";
import OffersListMob from "./OffersListMob";
import OffersTitle from "./OffersTitle";

export default function Offers() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <OffersTitle />
      <Container>
        <OffersListMob />
      </Container>
    </section>
  );
}
