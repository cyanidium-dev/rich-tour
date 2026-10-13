import { describe, expect, it } from "vitest";

import { mapTourPage, type RawTourPage } from "./mapTourPage";

const raw: RawTourPage = {
  _id: "basic-1",
  title: "Original title",
  slug: { current: "original-title" },
  description: "Description",
  duration: 4,
  earlyBooking: true,
  image: { asset: { url: "base.jpg" } },
  departures: [
    {
      _id: "future",
      crmNumber: "CRM-1",
      dateRange: { startDate: "2027-05-03" },
      availability: "limited",
      guaranteed: true,
      price: 800,
    },
    { _id: "missing-crm", dateRange: { startDate: "2027-05-04" } },
  ],
  selectedDeparture: {
    _id: "future",
    crmNumber: "CRM-1",
    title: "Departure title",
    gallery: [{ url: "gallery.jpg" }],
    benefits: [{ children: [{ text: "Benefit" }] }, { level: 2, children: [{ text: "Detail" }] }],
    includes: [{ children: [{ text: " Included " }] }],
    hotels: [{ title: "Hotel", stars: 4, price: 200, gallery: [{ url: "hotel.jpg" }] }],
  },
};

describe("mapTourPage", () => {
  it("selects saved frames for the hero, gallery, benefits and hotel placements", () => {
    const url = "https://cdn.sanity.io/images/project/production/example-2400x1200.jpg";
    const left = { left: 0.1, top: 0, right: 0.1, bottom: 0 };
    const right = { left: 0.2, top: 0, right: 0.2, bottom: 0 };
    const tour = mapTourPage({
      ...raw,
      image: { asset: { url }, displayCrops: { heroDesktop: left, heroMobile: right } },
      selectedDeparture: {
        ...raw.selectedDeparture!,
        gallery: [
          { url, displayCrops: { heroLeft: left, mobile: right, benefits: right } },
          { url, displayCrops: { heroRight: right } },
        ],
        hotels: [
          {
            title: "Hotel",
            price: 200,
            gallery: [{ url, displayCrops: { feature: left, card: right, modal: left } }],
          },
        ],
      },
    });
    expect(tour?.images[0].url).toContain("rect=240%2C0%2C1920%2C1200");
    expect(tour?.images[0].mobileUrl).toContain("rect=480%2C0%2C1440%2C1200");
    expect(tour?.images[1].url).toContain("rect=240%2C0%2C1920%2C1200");
    expect(tour?.benefits.image?.url).toContain("rect=480%2C0%2C1440%2C1200");
    expect(tour?.hotels?.[0].galleryVariants?.[0].card).toContain("rect=480%2C0%2C1440%2C1200");
    expect(tour?.hotels?.[0].galleryVariants?.[0].modal).toContain("rect=240%2C0%2C1920%2C1200");
  });

  it("keeps the selected departure and maps dates and content for booking", () => {
    const tour = mapTourPage(raw);
    expect(tour).toMatchObject({
      id: "future",
      selectedDepartureId: "future",
      crmNumber: "CRM-1",
      slug: "original-title",
      title: "Departure title",
      earlyBooking: true,
      images: [{ url: "base.jpg" }, { url: "gallery.jpg" }],
      benefits: { list: [{ text: "Benefit", sublist: ["Detail"] }] },
      includedInCost: ["Included"],
      hotels: [{ gallery: ["hotel.jpg"] }],
      tourDepartures: {
        "2027-05": [
          {
            day: 3,
            crmNumber: "CRM-1",
            departureId: "future",
            price: 800,
            status: ["limited", "guaranteed"],
          },
        ],
      },
    });
  });

  it("returns no bookable tour when no selected CRM departure exists", () => {
    expect(mapTourPage({ ...raw, selectedDeparture: null })).toBeNull();
    expect(mapTourPage({ ...raw, selectedDeparture: { _id: "future" } })).toBeNull();
  });

  it.each([undefined, null])("keeps a hotel without a star rating (%s)", (stars) => {
    const tour = mapTourPage({
      ...raw,
      selectedDeparture: {
        ...raw.selectedDeparture!,
        hotels: [{ title: "Unrated hotel", stars, price: 200, gallery: [{ url: "hotel.jpg" }] }],
      },
    });

    expect(tour?.hotels).toHaveLength(1);
    expect(tour?.hotels?.[0]).toMatchObject({ title: "Unrated hotel", price: 200 });
    expect(tour?.hotels?.[0]).not.toHaveProperty("stars");
  });
});
