import Container from "@/components/shared/container/Container";
import PromotionTitle from "./PromotionTitle";
import PromotionSwiperMob from "./PromotionSwiperMob";
import PromotionListDesk from "./PromotionListDesk";

const SECTION_ID = "promotion-tours-list";

export default function Promotion() {
  return (
    <section id={SECTION_ID} className="mb-[148px] xl:mb-[204px]">
      <Container>
        <PromotionTitle />
        <PromotionSwiperMob />
        <PromotionListDesk />
      </Container>
    </section>
  );
}
