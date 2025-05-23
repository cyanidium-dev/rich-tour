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

