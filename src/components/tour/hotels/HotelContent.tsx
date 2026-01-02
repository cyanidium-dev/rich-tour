import { PortableText } from "@portabletext/react";

//@ts-expect-error
export default function HotelContent({ value }) {
    return (
        <PortableText
            value={value}
            components={{
                block: {
                    normal: ({ children }) => (
                        <p className="mb-4 text-base font-normal">
                            {children}
                        </p>
                    ),
                },
                list: {
                    bullet: ({ children }) => (
                        <ul className="mt-4 space-y-2 list-disc list-inside text-base font-normal">
                            {children}
                        </ul>
                    ),
                },
                listItem: {
                    bullet: ({ children }) => <li>{children}</li>,
                },
            }}
        />
    );
}
