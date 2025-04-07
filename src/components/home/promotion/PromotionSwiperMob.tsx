import { toursList } from "./mockedData";

export default function PromotionSwiperMob() {
  if (!toursList || !toursList.length) {
    return null;
  }

  return <div className="md:hidden">PromotionSwiperMob</div>;
}
