import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import HotelModalContent from "./HotelModalContent";

const hotel = {
  title: "Hotel Dolores",
  stars: 3,
  description: [],
};

it("shows one image without gallery controls when the hotel has one photo", () => {
  const html = renderToStaticMarkup(<HotelModalContent {...hotel} gallery={["/one.jpg"]} />);

  expect(html).toContain("Hotel Dolores — фото 1");
  expect(html).not.toContain("Попереднє фото готелю");
  expect(html).not.toContain("Наступне фото готелю");
});

it("shows both gallery controls when the hotel has multiple photos", () => {
  const html = renderToStaticMarkup(
    <HotelModalContent {...hotel} gallery={["/one.jpg", "/two.jpg"]} />,
  );

  expect(html).toContain("Попереднє фото готелю");
  expect(html).toContain("Наступне фото готелю");
});

it("omits the star suffix when the rating is missing", () => {
  const html = renderToStaticMarkup(
    <HotelModalContent title="Hotel Dolores" description={[]} gallery={["/one.jpg"]} />,
  );

  expect(html).toContain("HOTEL DOLORES</h3>");
  expect(html).not.toContain("undefined*");
});
