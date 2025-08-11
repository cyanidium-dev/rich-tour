import Container from "@/components/shared/container/Container";
import PromotionTitle from "./PromotionTitle";
import PromotionSwiperMob from "./PromotionSwiperMob";
import PromotionListDesk from "./PromotionListDesk";

import client from "@/lib/sanity";
import {allBasicToursWithPromotionQuery} from "@/lib/queries";

const SECTION_ID = "promotion-tours-list";

export default async function Promotion() {
    const tours = await client.fetch(allBasicToursWithPromotionQuery);

    if(!tours || !tours.length) return null;

  return (
    <section id={SECTION_ID} className="mb-[148px] xl:mb-[204px]">
      <Container>
        <PromotionTitle />
        <PromotionListDesk />
      </Container>
      <PromotionSwiperMob />
    </section>
  );
}
