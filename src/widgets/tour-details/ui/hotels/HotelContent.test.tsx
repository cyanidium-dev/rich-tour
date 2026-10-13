import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import HotelContent from "./HotelContent";
import type { TourHotel } from "@/entities/tour";

it("keeps hotel paragraphs and list markup", () => {
  const value: TourHotel["fullDescription"] = [
    {
      _type: "block",
      _key: "p",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", text: "Hotel", marks: [] }],
    },
    {
      _type: "block",
      _key: "li",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [{ _type: "span", text: "Bullet", marks: [] }],
    },
  ];
  const html = renderToStaticMarkup(<HotelContent value={value} />);
  expect(html).toContain('class="mb-4 text-base font-normal"');
  expect(html).toContain("<li>Bullet</li>");
});
