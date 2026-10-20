export const allFaqQuery = `*[_type == "faq"] | order(_updatedAt desc, _id asc) {
  _id,
  title,
  text,
}`;

export const allDocQuery = `*[_type == "doc"] | order(publishedAt desc) {
  _id,
  name,
  doc {
    asset->{
      url
    }
  }
}`;

export const allTeamQuery = `*[_type == "team"] | order(_updatedAt desc, _id asc) {
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
}`;

export const currencySettingsQuery = `{
  "settings": *[_id == "siteSettings"][0]{eurMarkupUah, usdMarkupUah},
  "eurCache": *[_id == "privatEurRateCache"][0]{rate},
  "usdCache": *[_id == "privatUsdRateCache"][0]{rate}
}`;

export const allCountriesQuery = `*[_type == "country"] | order(title asc) {
  _id,
  title,
}`;

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

export const siteContactsQuery = `*[_id == "siteSettings" && _type == "siteSettings"][0].contacts{
  address,
  map,
  phone_1,
  phone_2,
  phone_3,
  email,
  working,
  weekend,
  instagram,
  facebook
}`;
