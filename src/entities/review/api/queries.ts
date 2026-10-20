export const lastReviewsQuery = `*[_type == "review" && verified == true] | order(_createdAt desc)[0...3] {
  _id,
  name,
  text,
  _createdAt,
}`;
export const allReviewsQuery = `*[_type == "review" && verified == true] | order(_createdAt desc) {
  _id,
  name,
  text,
  _createdAt,
}`;
