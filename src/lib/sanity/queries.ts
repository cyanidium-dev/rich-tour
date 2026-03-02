export const lastReviewsQuery = `*[_type == "review"] | order(publishedAt desc)[0...3] {
  _id,
  name,
  text,
  _createdAt,
}`

export const allReviewsQuery = `*[_type == "review"] | order(publishedAt desc) {
  _id,
  name,
  text,
  _createdAt,
}`

export const allFaqQuery = `*[_type == "faq"] | order(publishedAt desc) {
  _id,
  title,
  text,
}`

export const allDocQuery = `*[_type == "doc"] | order(publishedAt desc) {
  _id,
  name,
  doc {
    asset->{
      url
    }
  }
}`

export const allTeamQuery = `*[_type == "team"] | order(publishedAt desc) {
  _id,
  name,
  role,
  instagram,
  telegram,
  tiktok,
  photo {
    asset->{
      url
    }
  }
}`

export const mainTourCategoriesQuery = `*[_type == "tour-category" && main == true] | order(publishedAt desc)[0...5] {
  _id,
  title,
  image {
    asset->{
      url
    }
  }
}`

export const allActiveTourCategoriesQuery = `*[_type == "tour-category" && active == true] | order(publishedAt desc) {
  _id,
  title,
  image {
    asset->{
      url
    }
  }
}`


export const basicToursQuery = `*[_type == "tour-basic" && ($categoryId == null || $categoryId in categories[]._ref)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  description,
  categories,
  duration,
  image {
    asset->{
      url
    }
  }
}`

export const basicTourBySlugQuery = `*[_type == "tour-basic" && slug.current == $slug][0] {
 _id,
 title,
 slug,
 description,
  categories,
  duration,
  image {
    asset->{
      url
    }
  }
}`;

export const tourQuery = `*[_type == "tour-to-date" && basic._ref == $tourBasicId] | order(dateRange.startDate asc)[0] {
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
      asset->{
        url
      }
    }
  },
additionalConditions,
gallery[]{
    "url": asset->url
  },
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

export const tourDatesQuery = `*[_type == "tour-to-date" && basic._ref == $tourBasicId && dateRange.startDate >= now()] | order(dateRange.startDate asc) {
    crmNumber,
    dateRange,
    price,
}`;

export const allBasicSMARTToursQuery = `*[_type == "tour-basic" && "53499507-30ed-4085-b861-f34fc0749408" in categories[]._ref] | order(publishedAt desc) {
  _id,
  title,
  slug,
  description,
  categories,
  duration,
  image {
    asset->{
      url
    }
  }
}`

export const allBasicToursWithPromotionQuery = `*[_type == "tour-basic" && _id in *[_type == "tour-to-date" && promotion == true].tour-basic._ref] | order(publishedAt desc) {
  _id,
  title,
  slug,
  description,
  image {
    asset->{
      url
    }
  }
}`

export const currencyQuery = `*[_type == "currency"][0]{
  usd_currency,
  usd_percent,
  euro_currency,
  euro_percent
}`
//
// export const basicToursQuery = `*[_type == "tour-basic" && ($categoryId == null || $categoryId in categories[]._ref)] | booking(publishedAt desc) {
//   _id,
//   title,
//   slug,
//   description,
//   categories,
//   duration,
//   image {
//     asset->{
//       url
//     }
//   }
// }`

export const tourSearchQuery = `*[_type == "tour-basic" && ($categoryId == null || $categoryId in categories[]._ref)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  description,
  categories,
  duration,
  image {
    asset->{
      url
    }
  }
}`

export const allCOuntriesQuery = `*[_type == "country"]{
  _id,
  title,
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  agentContract {
    asset->{
      url
    }
  },
  touristContract {
    asset->{
      url
    }
  },
  telegram
}`;
