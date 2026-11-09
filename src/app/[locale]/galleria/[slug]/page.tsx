import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SanityImage } from '@/components/content/SanityImage'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { isLocale } from '@/i18n/config'
import { formatDate } from '@/lib/format'
import { getGalleryAlbum, getGalleryAlbums, slugParams } from '@/sanity/lib/data'
import { urlForImage } from '@/sanity/lib/image'

export async function generateStaticParams() {
  return slugParams((await getGalleryAlbums('it')).map((album) => album.slug))
}

async function load(params: PageProps<'/[locale]/galleria/[slug]'>['params']) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const album = await getGalleryAlbum(locale, slug)
  if (!album) notFound()
  return { locale, album }
}

export async function generateMetadata({ params }: PageProps<'/[locale]/galleria/[slug]'>): Promise<Metadata> {
  const { album } = await load(params)
  return { title: album.title, description: album.description ?? undefined }
}

export default async function AlbumPage({ params }: PageProps<'/[locale]/galleria/[slug]'>) {
  const { locale, album } = await load(params)

  return (
    <>
      <PageHeader
        title={album.title}
        intro={[album.date && formatDate(album.date, locale), album.description].filter(Boolean).join(' · ')}
      />
      <Section>
        <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {album.images?.map((image) => (
            <li key={image._key} className="mb-4 break-inside-avoid">
              <figure>
                <a href={urlForImage(image).width(2000).url()} target="_blank" rel="noopener noreferrer">
                  <SanityImage
                    image={image}
                    width={800}
                    height={600}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="w-full rounded-2xl"
                  />
                </a>
                {image.caption && <figcaption className="mt-2 text-sm text-ink-muted">{image.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
