import {
  PortableText,
  type PortableTextBlock as RenderedPortableTextBlock,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from "@portabletext/react";
import type { ReactNode } from "react";
import type { PortableTextBlock } from "@/shared/lib";
import styles from "./BlockContent.module.css";

function isFullyStrong(block: RenderedPortableTextBlock) {
  const textSpans = block.children?.filter(
    (child) => child._type === "span" && typeof child.text === "string" && child.text.trim(),
  );

  return Boolean(
    textSpans?.length &&
      textSpans.every((span) => Array.isArray(span.marks) && span.marks.includes("strong")),
  );
}

function renderHeader(children: ReactNode, largeBullet = false) {
  return (
    <div className="flex gap-x-5 mb-4">
      <div
        className={`${largeBullet ? "size-6" : "size-[18px]"} shrink-0 bg-main rounded-full mt-[4px]`}
        style={{
          opacity: 1,
          transform: "translate3d(0px, 0px, 0px) scale3d(1, 1, 1)",
          willChange: "opacity, transform",
        }}
      />
      <p
        className={
          largeBullet
            ? "min-w-0 flex-1 text-[20px] font-semibold leading-[1.23]"
            : "min-w-0 flex-1 text-20med font-normal"
        }
      >
        {children}
      </p>
    </div>
  );
}

const blockComponents: NonNullable<PortableTextComponents["block"]> = {
  normal: ({ children }) => (
    <p className="mb-3 xl:mb-3 ml-10 text-14reg xl:text-16reg">{children}</p>
  ),

  h1: ({ children }) => renderHeader(children),
  h2: ({ children }) => renderHeader(children),
  h3: ({ children }) => renderHeader(children),
  h4: ({ children }) => renderHeader(children),

  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-400 pl-4 italic my-4 text-gray-600">
      {children}
    </blockquote>
  ),
};

const components: Partial<PortableTextComponents> = {
  // types: {
  //     image: ({ value }) => {
  //         const imageUrl = value?.asset?._ref
  //             ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${value.asset._ref
  //                 .replace('image-', '')
  //                 .replace('-webp', '.webp')
  //                 .replace('-jpg', '.jpg')
  //                 .replace('-png', '.png')}`
  //             : null
  //
  //         return (
  //             imageUrl && (
  //                 <div className="my-6">
  //                     <Image
  //                         src={imageUrl}
  //                         alt={value.alt || ''}
  //                         width={800}
  //                         height={500}
  //                         className="rounded-2xl"
  //                     />
  //                 </div>
  //             )
  //         )
  //     },
  // },

  marks: {
    link: ({
      children,
      value,
    }: PortableTextMarkComponentProps<{ _type: "link"; href: string }>) => {
      const rel = !value!.href.startsWith("/") ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value!.href}
          rel={rel}
          target={rel ? "_blank" : undefined}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {children}
        </a>
      );
    },
    // strong: ({ children }) => (
    //     <div className="flex gap-x-5">
    //         <div
    //             className="size-[18px] bg-main rounded-full mt-[4px]"
    //             style={{
    //                 opacity: 1,
    //                 transform:
    //                     'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)',
    //                 willChange: 'opacity, transform',
    //             }}
    //         />
    //         <p className="max-w-[calc(100%-18px-20px)] xl:max-w-[calc(100%-24px-20px)] text-20med">
    //             {children}
    //         </p>
    //     </div>
    // ),
  },

  block: blockComponents,

  list: {
    bullet: ({ children }) => <ul className="list-disc ml-6 space-y-2">{children}</ul>,
  },
};

type ProgramLine = {
  children: RenderedPortableTextBlock["children"];
  endsWithBreak: boolean;
};

function splitProgramLines(block: RenderedPortableTextBlock): ProgramLine[] {
  const lines: ProgramLine[] = [{ children: [], endsWithBreak: false }];

  for (const child of block.children) {
    if (child._type !== "span" || typeof child.text !== "string") {
      lines[lines.length - 1].children.push(child);
      continue;
    }

    child.text.split("\n").forEach((part, index, parts) => {
      if (part) {
        lines[lines.length - 1].children.push({
          ...child,
          _key: `${child._key ?? "span"}-${lines.length}`,
          text: part,
        });
      }
      if (index < parts.length - 1) {
        lines[lines.length - 1].endsWithBreak = true;
        lines.push({ children: [], endsWithBreak: false });
      }
    });
  }

  return lines;
}

const programLineComponents: Partial<PortableTextComponents> = {
  marks: components.marks,
  block: { normal: ({ children }) => <>{children}</> },
};

function ProgramLines({ value }: { value: RenderedPortableTextBlock }) {
  return (
    <div className={styles.programLines}>
      {splitProgramLines(value).map((line, index) => {
        const isStrong = isFullyStrong({ ...value, children: line.children });
        const className = `${styles.programLine} ${isStrong ? styles.programStrongLine : styles.programPlainLine}${isStrong && line.endsWithBreak ? ` ${styles.programDottedLine}` : ""}`;

        return (
          <p className={className} key={`${value._key ?? "block"}-${index}`}>
            {line.children.length ? (
              <PortableText
                value={[{ ...value, children: line.children }]}
                components={programLineComponents}
              />
            ) : (
              <br />
            )}
          </p>
        );
      })}
    </div>
  );
}

const programComponents: Partial<PortableTextComponents> = {
  ...components,
  block: {
    ...blockComponents,
    normal: ({ children, value }) => {
      if (value.children?.some((child) => child._type === "span" && child.text?.includes("\n"))) {
        return <ProgramLines value={value} />;
      }

      return (
        <p className={isFullyStrong(value) ? styles.programHighlight : styles.programParagraph}>
          {children}
        </p>
      );
    },
    h1: ({ children }) => renderHeader(children, true),
    h2: ({ children }) => renderHeader(children, true),
    h3: ({ children }) => renderHeader(children, true),
    h4: ({ children }) => renderHeader(children, true),
  },
  list: {
    bullet: ({ children }) => <ul className={styles.programList}>{children}</ul>,
  },
};

export default function BlockContent({
  value,
  programListStyle = false,
}: {
  value: PortableTextBlock[] | undefined;
  programListStyle?: boolean;
}) {
  return (
    <PortableText
      value={value ?? []}
      components={programListStyle ? programComponents : components}
    />
  );
}
