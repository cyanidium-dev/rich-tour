import { describe, expect, it } from "vitest";

import { mapTourPage, mapTourPreview, type RawTourPage } from "./mapTourPage";

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
    heroMainImage: { url: "departure.jpg" },
    benefits: [{ children: [{ text: "Benefit" }] }, { level: 2, children: [{ text: "Detail" }] }],
    includes: [{ children: [{ text: " Included " }] }],
    hotels: [{ title: "Hotel", stars: 4, price: 200, gallery: [{ url: "hotel.jpg" }] }],
  },
};

describe("mapTourPage", () => {
  it("selects independent frames for each tour placement", () => {
    const url = "https://cdn.sanity.io/images/project/production/example-2400x1200.jpg";
    const left = { left: 0.1, top: 0, right: 0.1, bottom: 0 };
    const right = { left: 0.2, top: 0, right: 0.2, bottom: 0 };
    const tour = mapTourPage({
      ...raw,
      image: { asset: { url }, displayCrops: { heroDesktop: left, heroMobile: right } },
      selectedDeparture: {
        ...raw.selectedDeparture!,
        heroMainImage: { url, displayCrops: { heroDesktop: left, heroMobile: right } },
        heroLeftImage: { url, displayCrops: { heroLeft: right, mobile: left } },
        heroRightImage: { url, displayCrops: { heroRight: left } },
        benefitsImage: { url, displayCrops: { benefits: right } },
        costShortImage: { url, displayCrops: { costShort: left } },
        costTallImage: { url, displayCrops: { costTall: right } },
        hotels: [
          {
            title: "Hotel",
            price: 200,
            gallery: [{ url, displayCrops: { feature: left, card: right, modal: left } }],
          },
        ],
      },
    });
    expect(tour?.heroImages.main?.url).toContain("rect=240%2C0%2C1920%2C1200");
    expect(tour?.heroImages.main?.mobileUrl).toContain("rect=480%2C0%2C1440%2C1200");
    expect(tour?.heroImages.left?.url).toContain("rect=480%2C0%2C1440%2C1200");
    expect(tour?.heroImages.right?.url).toContain("rect=240%2C0%2C1920%2C1200");
    expect(tour?.benefits.image?.url).toContain("rect=480%2C0%2C1440%2C1200");
    expect(tour?.costImages.short?.url).toContain("rect=240%2C0%2C1920%2C1200");
    expect(tour?.costImages.tall?.url).toContain("rect=480%2C0%2C1440%2C1200");
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
      heroImages: { main: { url: "departure.jpg" } },
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

  it("leaves missing image slots empty without substituting the basic-tour image", () => {
    const tour = mapTourPage({
      ...raw,
      selectedDeparture: { ...raw.selectedDeparture!, heroMainImage: undefined },
    });
    expect(tour?.heroImages).toEqual({ main: undefined, left: undefined, right: undefined });
    expect(tour?.costImages).toEqual({ short: undefined, tall: undefined });
    expect(tour?.benefits.image).toBeUndefined();
    expect(tour?.benefits.list).toHaveLength(1);
  });

  it("uses images from the selected departure when the date changes", () => {
    const changed = mapTourPage({
      ...raw,
      selectedDeparture: {
        ...raw.selectedDeparture!,
        _id: "second-date",
        heroMainImage: { url: "second-date.jpg" },
        benefitsImage: { url: "second-benefit.jpg" },
      },
    });
    expect(changed?.selectedDepartureId).toBe("second-date");
    expect(changed?.heroImages.main?.url).toBe("second-date.jpg");
    expect(changed?.benefits.image?.url).toBe("second-benefit.jpg");
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

it("renders an incomplete preview without a basic tour or CRM number", () => {
  const preview = mapTourPreview({
    _id: "draft-date",
    title: "Saved draft title",
    dateRange: { startDate: "2027-05-03" },
    price: 700,
  });
  expect(preview?.missing).toEqual({
    title: false,
    duration: true,
    basic: true,
    date: false,
    crm: true,
    price: false,
  });
  expect(preview?.tour).toMatchObject({
    selectedDepartureId: "draft-date",
    title: "Saved draft title",
    crmNumber: "",
    tourDepartures: { "2027-05": [{ day: 3, price: 700, departureId: "draft-date" }] },
  });
});
