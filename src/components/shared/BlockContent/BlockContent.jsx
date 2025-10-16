// components/BlockContent.js
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

const components = {
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
        link: ({ children, value }) => {
            const rel = !value.href.startsWith('/')
                ? 'noopener noreferrer'
                : undefined
            return (
                <a
                    href={value.href}
                    rel={rel}
                    target={rel ? '_blank' : undefined}
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    {children}
                </a>
            )
        },
        strong: ({ children }) => (
            <div className="flex gap-x-5">
                <div
                    className="size-[18px] bg-main rounded-full mt-[4px]"
                    style={{
                        opacity: 1,
                        transform:
                            'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)',
                        willChange: 'opacity, transform',
                    }}
                />
                <p className="max-w-[calc(100%-18px-20px)] xl:max-w-[calc(100%-24px-20px)] text-20med">
                    {children}
                </p>
            </div>
        ),
    },

    block: {
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-medium mt-4 mb-2">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-xl font-medium mt-3 mb-2">{children}</h4>
        ),
        normal: ({ children }) => (
            <p className="mb-7 xl:mb-10 text-14reg xl:text-20reg">{children}</p>
        ),
        blockquote: ({children}) => (
            <blockquote className="border-l-4 border-gray-400 pl-4 italic my-4 text-gray-600">
                {children}
            </blockquote>
        ),
    },

    list: {
        bullet: ({ children }) => (
            <ul className="list-disc ml-6 space-y-2">{children}</ul>
        ),
    },
}

export default function BlockContent({ value }) {
    return <PortableText value={value} components={components} />
}
