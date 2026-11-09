import Image from 'next/image'

import { urlForImage } from '@/sanity/lib/image'
import type { SanityImage as SanityImageType } from '@/sanity/lib/types'

/** Responsive image served from the Sanity CDN, cropped around the editor's hotspot. */
export function SanityImage({
  image,
  alt,
  width,
  height,
  sizes = '100vw',
  className = '',
  priority = false,
}: {
  image: SanityImageType | null | undefined
  alt?: string
  width: number
  height: number
  sizes?: string
  className?: string
  priority?: boolean
}) {
  if (!image?.asset?._ref) return null
  const src = urlForImage(image).width(width).height(height).fit('crop').url()
  return (
    <Image src={src} alt={alt ?? image.alt ?? ''} width={width} height={height} sizes={sizes} className={className} priority={priority} />
  )
}
