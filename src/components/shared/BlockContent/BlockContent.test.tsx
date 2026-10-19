import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import BlockContent from "./BlockContent";
import type { PortableTextBlock } from "@/shared/lib";

const paragraph = (text: string, style = "normal"): PortableTextBlock => ({
  _type: "block",
  _key: text,
  style,
  children: [{ _type: "span", _key: text, text, marks: [] }],
  markDefs: [],
});

it("keeps headings, paragraph and bullet styles in program text", () => {
  const bullet = { ...paragraph("Bullet"), listItem: "bullet", level: 1 };
  const html = renderToStaticMarkup(
    <BlockContent value={[paragraph("Heading", "h2"), paragraph("Text"), bullet]} />,
  );
  expect(html).toContain('class="flex gap-x-5 mb-4"');
  expect(html).toContain('class="mb-3 xl:mb-3 ml-10 text-14reg xl:text-16reg"');
  expect(html).toContain('class="list-disc ml-6 space-y-2"');
});

it("styles program headings and both bullet list levels", () => {
  const first = { ...paragraph("First"), listItem: "bullet", level: 1 };
  const second = { ...paragraph("Second"), listItem: "bullet", level: 2 };
  const html = renderToStaticMarkup(
    <BlockContent
      value={[paragraph("Heading", "h2"), first, second, paragraph("Description")]}
      programListStyle
    />,
  );

  expect(html).toContain("size-6 shrink-0 bg-main rounded-full");
  expect(html).toContain('class="min-w-0 flex-1 text-[20px] font-semibold leading-[1.23]"');
  expect(html.match(/<ul class="[^"]*programList[^"]*"/g)).toHaveLength(2);
  expect(html).toMatch(/<li>First<ul class="[^"]*programList[^"]*"><li>Second<\/li><\/ul><\/li>/);
  expect(html).toMatch(/<\/ul><p class="[^"]*programParagraph[^"]*">Description<\/p>/);
});

it("keeps relative links in the tab and opens external links securely", () => {
  for (const href of ["/contacts", "https://example.invalid"]) {
    const value = [
      {
        ...paragraph("Link"),
        markDefs: [{ _type: "link", _key: "link", href }],
        children: [{ _type: "span", _key: "link", text: "Link", marks: ["link"] }],
      },
    ];
    const html = renderToStaticMarkup(<BlockContent value={value} />);
    expect(html).toContain(`href="${href}"`);
    if (href.startsWith("/")) expect(html).not.toContain('target="_blank"');
    else {
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    }
  }
  expect(renderToStaticMarkup(<BlockContent value={undefined} />)).toBe("");
});
