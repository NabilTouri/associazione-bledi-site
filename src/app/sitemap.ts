import type { MetadataRoute } from 'next'

import { localeTags, locales } from '@/i18n/config'
import { routes, siteUrl } from '@/lib/site'
import { getEventSlugs, getGalleryAlbums, getPostSlugs } from '@/sanity/lib/data'

function entry(path: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}/it${path}`,
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [localeTags[locale], `${siteUrl}/${locale}${path}`])),
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, events, albums] = await Promise.all([getPostSlugs(), getEventSlugs(), getGalleryAlbums('it')])
  return [
    ...Object.values(routes).map(entry),
    ...posts.map((slug) => entry(`/notizie/${slug}`)),
    ...events.map((slug) => entry(`/eventi/${slug}`)),
    ...albums.map((album) => entry(`/galleria/${album.slug}`)),
  ]
}
