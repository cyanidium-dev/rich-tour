export const mainTourCategoriesQuery = `*[_type == "tour-category" && main == true] | order(publishedAt desc)[0...5] {
  _id,
  title,
  image {
    displayCrops,
    asset->{
      url
    }
  }
}`;

export const allActiveTourCategoriesQuery = `*[_type == "tour-category" && active == true] | order(publishedAt desc) {
  _id,
  title,
  image {
    displayCrops,
    asset->{
      url
    }
  }
}`;

export const basicToursQuery = `*[
  _type == "tour-basic" &&
  ($categoryId == null || $categoryId in categories[]._ref) &&
  count(*[
    _type == "tour-to-date" &&
    basic._ref == ^._id &&
    dateTime(dateRange.startDate + "T23:59:59Z") >= dateTime(now())
  ]) > 0
] | order(_updatedAt desc) {
  _id,
  title,
  slug,
  description,
  categories,
  duration,
  earlyBooking,
  "isOnPromo": count(*[
    _type == "tour-to-date" &&
    basic._ref == ^._id &&
    promotion == true &&
    dateTime(dateRange.startDate + "T23:59:59Z") >= dateTime(now())
  ]) > 0,
  image {
    displayCrops,
    asset->{
      url
    }
  }
}`;

export const basicTourBySlugQuery = `*[_type == "tour-basic" && slug.current == $slug][0] {
 _id,
 title,
 slug,
 description,
  categories,
  duration,
  image {
    displayCrops,
    asset->{
      url
    }
  }
}`;

export const tourQuery = `*[_type == "tour-to-date" && basic._ref == $tourBasicId] | order(dateRange.startDate asc)[0] {
_id,
title,
dateRange,
guaranteed,
hot,
crmNumber,
agencyCommission,
discount,
availability,
 hotels[]{
    title,
    stars,
    price,
    shortDescription,
    fullDescription,
    gallery[]{
      asset->{url}, displayCrops
    }
  },
additionalConditions,
heroMainImage { "url": asset->url, displayCrops },
heroLeftImage { "url": asset->url, displayCrops },
heroRightImage { "url": asset->url, displayCrops },
benefitsImage { "url": asset->url, displayCrops },
costShortImage { "url": asset->url, displayCrops },
costTallImage { "url": asset->url, displayCrops },
  programUpload {
    "url": asset->url,
    originalFilename,
    mimeType
  },
  benefits,
  sections,
  excursions,
  route,
  includes,
  unincludes,
  inspiration,
}`;

export const tourDatesQuery = `*[_type == "tour-to-date" && basic._ref == $tourBasicId && dateTime(dateRange.startDate + "T23:59:59Z") >= dateTime(now())] | order(dateRange.startDate asc) {
    _id,
    crmNumber,
    dateRange,
    price,
    availability,
}`;

export const tourPageQuery = `*[_type == "tour-basic" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  duration,
  earlyBooking,
  image { asset->{ url }, displayCrops },
  "departures": *[
    _type == "tour-to-date" &&
    basic._ref == ^._id &&
    dateTime(dateRange.startDate + "T23:59:59Z") >= dateTime(now())
  ] | order(dateRange.startDate asc) {
    _id,
    crmNumber,
    dateRange,
    price,
    availability,
    guaranteed,
    hot,
    discount
  },
  "selectedDeparture": *[
    _type == "tour-to-date" &&
    basic._ref == ^._id &&
    (
      (defined($departureId) && _id == $departureId) ||
      (!defined($departureId) && dateTime(dateRange.startDate + "T23:59:59Z") >= dateTime(now()))
    )
  ] | order(dateRange.startDate asc)[0] {
    _id,
    title,
    dateRange,
    guaranteed,
    hot,
    crmNumber,
    agencyCommission,
    discount,
    availability,
    hotels[]{
      title,
      stars,
      price,
      shortDescription,
      fullDescription,
      gallery[]{ "url": asset->url, displayCrops }
    },
    additionalConditions,
    heroMainImage { "url": asset->url, displayCrops },
    heroLeftImage { "url": asset->url, displayCrops },
    heroRightImage { "url": asset->url, displayCrops },
    benefitsImage { "url": asset->url, displayCrops },
    costShortImage { "url": asset->url, displayCrops },
    costTallImage { "url": asset->url, displayCrops },
    programUpload { "url": asset->url, originalFilename, mimeType },
    benefits,
    sections,
    excursions,
    route,
    includes,
    unincludes,
    inspiration[]{
      title,
      description,
      image { "url": asset->url, displayCrops }
    }
  }
}`;

export const previewTourDepartureQuery = `*[_type == "tour-to-date" && _id == $id][0]{
  _id,
  "basicId": basic._ref,
  "basicTour": basic->{
    _id, title, slug, description, duration, earlyBooking,
    image { asset->{ url }, displayCrops }
  },
  title,
  crmNumber,
  dateRange,
  price,
  availability,
  guaranteed,
  hot,
  agencyCommission,
  discount,
  hotels[]{
    title, stars, price, shortDescription, fullDescription,
    gallery[]{ "url": asset->url, displayCrops }
  },
  additionalConditions,
  heroMainImage { "url": asset->url, displayCrops },
  heroLeftImage { "url": asset->url, displayCrops },
  heroRightImage { "url": asset->url, displayCrops },
  benefitsImage { "url": asset->url, displayCrops },
  costShortImage { "url": asset->url, displayCrops },
  costTallImage { "url": asset->url, displayCrops },
  programUpload { "url": asset->url, originalFilename, mimeType },
  benefits,
  sections,
  excursions,
  route,
  includes,
  unincludes,
  inspiration[]{
    title, description, image { "url": asset->url, displayCrops }
  }
}`;

export const publishedTourDepartureExistsQuery = `count(*[_type == "tour-to-date" && _id == $id]) > 0`;

const activeSMARTToursFilter = `
  _type == "tour-basic" &&
  "53499507-30ed-4085-b861-f34fc0749408" in categories[]._ref &&
  count(*[
    _type == "tour-to-date" &&
    basic._ref == ^._id &&
    dateRange.startDate >= $today
  ]) > 0
`;

export const hasBasicSMARTToursQuery = `count(*[${activeSMARTToursFilter}]) > 0`;

export const allBasicSMARTToursQuery = `*[
  ${activeSMARTToursFilter}
] | order(_updatedAt desc) {
  _id,
  title,
  slug,
  description,
  categories,
  duration,
  earlyBooking,
  image {
    displayCrops,
    asset->{
      url
    }
  }
}`;

export const allBasicToursWithPromotionQuery = `*[
  _type == "tour-basic" &&
  _id in *[
    _type == "tour-to-date" &&
    promotion == true &&
    dateTime(dateRange.startDate + "T23:59:59Z") >= dateTime(now())
  ].basic._ref
] | order(_updatedAt desc) {
  _id,
  title,
  slug,
  description,
  duration,
  earlyBooking,
  "isOnPromo": true,
  image {
    displayCrops,
    asset->{
      url
    }
  }
}`;

export const searchToursQuery = `*[
  _type == "tour-basic" &&
  ($countryId == null || $countryId in countries[]._ref) &&
  count(*[
    _type == "tour-to-date" &&
    basic._ref == ^._id &&
    dateTime(dateRange.startDate + "T23:59:59Z") >= dateTime(now()) &&
    ($monthPattern == null || dateRange.startDate match $monthPattern)
  ]) > 0
] | order(_updatedAt desc) {
  _id,
  title,
  slug,
  description,
  duration,
  earlyBooking,
  "isOnPromo": count(*[
    _type == "tour-to-date" &&
    basic._ref == ^._id &&
    promotion == true &&
    dateTime(dateRange.startDate + "T23:59:59Z") >= dateTime(now())
  ]) > 0,
  image { asset->{ url }, displayCrops }
}`;
