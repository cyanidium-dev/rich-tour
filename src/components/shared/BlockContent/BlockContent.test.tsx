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

it("adds a program bullet only when the whole paragraph is strong", () => {
  const highlighted = {
    ...paragraph("Highlighted"),
    children: [
      { _type: "span", _key: "strong", text: "Highlighted", marks: ["strong"] },
      { _type: "span", _key: "space", text: " ", marks: [] },
    ],
  };
  const partial = {
    ...paragraph("Partial"),
    children: [
      { _type: "span", _key: "partial-strong", text: "Partial", marks: ["strong"] },
      { _type: "span", _key: "partial-plain", text: " text", marks: [] },
    ],
  };
  const value = [highlighted, paragraph("Description"), partial, paragraph("Plain")];
  const html = renderToStaticMarkup(<BlockContent value={value} programListStyle />);

  expect(html).toMatch(/<p class="[^"]*programHighlight[^"]*"><strong>Highlighted<\/strong> <\/p>/);
  expect(html.match(/programHighlight/g)).toHaveLength(1);
  expect(html.match(/programParagraph/g)).toHaveLength(3);
  expect(html).toMatch(/<\/p><p class="[^"]*programParagraph[^"]*">Description<\/p>/);

  const regularHtml = renderToStaticMarkup(<BlockContent value={[highlighted]} />);
  expect(regularHtml).not.toContain("programHighlight");
});

it("adds a program bullet when a strong opening line ends with a break", () => {
  const breakInsideStrong = {
    ...paragraph("Inside"),
    children: [
      { _type: "span", _key: "inside-strong", text: "Heading\n", marks: ["strong"] },
      { _type: "span", _key: "inside-plain", text: "Description", marks: [] },
    ],
  };
  const breakAfterStrong = {
    ...paragraph("After"),
    children: [
      { _type: "span", _key: "after-strong", text: "Heading", marks: ["strong"] },
      { _type: "span", _key: "after-break", text: "\nDescription", marks: [] },
    ],
  };
  const plainBeforeBreak = {
    ...paragraph("Plain before break"),
    children: [
      { _type: "span", _key: "partial-strong", text: "Heading", marks: ["strong"] },
      { _type: "span", _key: "partial-plain", text: " and more\nDescription", marks: [] },
    ],
  };
  const value = [breakInsideStrong, breakAfterStrong, plainBeforeBreak];
  const html = renderToStaticMarkup(<BlockContent value={value} programListStyle />);

  expect(html.match(/programDottedLine/g)).toHaveLength(2);
  expect(html.match(/programStrongLine/g)).toHaveLength(2);
  expect(html).toContain("<strong>Heading</strong>");
  expect(html).toContain("<strong>Heading</strong> and more");
  expect(renderToStaticMarkup(<BlockContent value={value} />)).not.toContain("programHighlight");
});

it("keeps strong lines after a break in the same program paragraph", () => {
  const value = [
    {
      ...paragraph("Travel day"),
      children: [
        { _type: "span", _key: "travel", text: "Travel\n", marks: [] },
        { _type: "span", _key: "arrival", text: "Arrival", marks: ["strong"] },
        { _type: "span", _key: "arrival-break", text: "\nDescription\n", marks: [] },
        { _type: "span", _key: "departure", text: "Departure", marks: ["strong"] },
        { _type: "span", _key: "departure-break", text: "\nMore text with ", marks: [] },
        { _type: "span", _key: "inline-strong", text: "inline emphasis", marks: ["strong"] },
        { _type: "span", _key: "inline-end", text: " and more\n", marks: [] },
        { _type: "span", _key: "night", text: "Night transit", marks: ["strong"] },
      ],
    },
  ];
  const html = renderToStaticMarkup(<BlockContent value={value} programListStyle />);

  expect(html.match(/programDottedLine/g)).toHaveLength(2);
  expect(html.match(/programStrongLine/g)).toHaveLength(3);
  expect(html).toMatch(/programDottedLine[^\"]*"><strong>Arrival<\/strong><\/p>/);
  expect(html).toMatch(/programDottedLine[^\"]*"><strong>Departure<\/strong><\/p>/);
  expect(html).toMatch(
    /programPlainLine[^\"]*">More text with <strong>inline emphasis<\/strong> and more<\/p>/,
  );
  expect(html).toMatch(/programStrongLine[^\"]*"><strong>Night transit<\/strong><\/p>/);
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
