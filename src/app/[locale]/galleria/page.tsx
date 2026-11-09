import { Images } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { SanityImage } from '@/components/content/SanityImage'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { formatDate } from '@/lib/format'
import { href } from '@/lib/site'
import { getGalleryAlbums } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.gallery.title, description: dict.gallery.intro }
}

export default async function GalleryPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const albums = await getGalleryAlbums(locale)

  return (
    <>
      <PageHeader title={dict.gallery.title} intro={dict.gallery.intro} />
      <Section>
        {albums.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <li key={album._id} className="group relative overflow-hidden rounded-3xl bg-surface-raised ring-1 ring-border">
                <div className="aspect-[4/3] overflow-hidden bg-surface-alt">
                  <SanityImage
                    image={album.cover}
                    width={800}
                    height={600}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-ink-heading">
                    <Link href={href(locale, `/galleria/${album.slug}`)} className="after:absolute after:inset-0">
                      {album.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {album.date && `${formatDate(album.date, locale)} · `}
                    {album.count} {dict.common.photos}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-surface-raised p-12 text-center ring-1 ring-border">
            <Images aria-hidden className="size-10 text-border-control" />
            <p className="text-ink-muted">{dict.gallery.empty}</p>
          </div>
        )}
      </Section>
    </>
  )
}
