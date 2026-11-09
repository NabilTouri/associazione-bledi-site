import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'

import type { SanityImage as SanityImageType } from '@/sanity/lib/types'

import { SanityImage } from './SanityImage'

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageType }) => (
      <figure>
        <SanityImage image={value} width={1200} height={750} sizes="(min-width: 768px) 720px, 100vw" className="rounded-2xl" />
      </figure>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? '#'
      const external = /^https?:\/\//.test(href)
      return (
        <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      )
    },
  },
}

export function RichText({ value }: { value: PortableTextBlock[] | null | undefined }) {
  if (!value?.length) return null
  return (
    <div className="prose-content">
      <PortableText value={value} components={components} />
    </div>
  )
}
