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


