import { Container } from "@/shared/ui/index";
import PromotionTitle from "./PromotionTitle";
import PromotionSwiperMob from "./PromotionSwiperMob";
import PromotionListDesk from "./PromotionListDesk";

import { sanityClient as client, sanityFetchOptions, SANITY_CACHE_TAGS } from "@/shared/api/server";
import { allBasicToursWithPromotionQuery } from "@/entities/tour/server";
import { TourShortInfo } from "@/entities/tour/index";

const SECTION_ID = "promotion-tours-list";

export default async function Promotion() {
  const tours = await client.fetch<TourShortInfo[]>(
    allBasicToursWithPromotionQuery,
    {},
    sanityFetchOptions(300, [SANITY_CACHE_TAGS.tours]),
  );

  if (!tours || !tours.length) return null;

  return (
    <section id={SECTION_ID} className="mb-[148px] xl:mb-[204px]">
      <Container>
        <PromotionTitle />
        <PromotionListDesk tours={tours} />
      </Container>
      <PromotionSwiperMob tours={tours} />
    </section>
  );
}
