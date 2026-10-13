import "server-only";

export { mapTourPage } from "./model/mapTourPage";
export type { RawTourPage } from "./model/mapTourPage";
export {
  mainTourCategoriesQuery,
  allActiveTourCategoriesQuery,
  basicToursQuery,
  basicTourBySlugQuery,
  tourQuery,
  tourDatesQuery,
  tourPageQuery,
  allBasicSMARTToursQuery,
  hasBasicSMARTToursQuery,
  allBasicToursWithPromotionQuery,
  searchToursQuery,
} from "./api/queries";
export { getSmartTours, hasSmartTours } from "./api/smartTours";
