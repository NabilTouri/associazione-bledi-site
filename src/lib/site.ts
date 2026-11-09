import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import type { SiteSettings } from '@/sanity/lib/types'

/** Production domain, the Vercel preview URL, or localhost. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
).replace(/\/$/, '')

/** Used until the real data is entered in Sanity ("Impostazioni del sito"). */
export const defaultSettings = {
  address: 'Brescia (BS), Italia',
  mapQuery: 'Brescia, Italia',
  location: { lat: 45.5416, lng: 10.2118 },
} as const

export function resolveSettings(settings: SiteSettings | null, dict: Dictionary) {
  return {
    title: settings?.title ?? dict.meta.siteName,
    tagline: settings?.tagline ?? dict.meta.tagline,
    description: settings?.description ?? dict.meta.description,
    email: settings?.email ?? null,
    phone: settings?.phone ?? null,
    address: settings?.address ?? defaultSettings.address,
    mapQuery: settings?.mapQuery ?? settings?.address ?? defaultSettings.mapQuery,
    location: settings?.location?.lat && settings.location.lng ? settings.location : defaultSettings.location,
    social: settings?.social?.filter((item) => item.url) ?? [],
    runtsStatus: settings?.runtsStatus ?? 'not_registered',
    runtsNumber: settings?.runtsNumber ?? null,
    fiscalCode: settings?.fiscalCode ?? null,
    iban: settings?.iban ?? null,
    donationsEnabled: settings?.donationsEnabled ?? false,
    membershipFee: settings?.membershipFee ?? null,
    isPlaceholder: !settings,
  }
}
export type ResolvedSettings = ReturnType<typeof resolveSettings>

export type NavKey = keyof Pick<
  Dictionary['nav'],
  'home' | 'about' | 'news' | 'events' | 'activities' | 'gallery' | 'donate' | 'join' | 'transparency' | 'contact' | 'privacy'
>

export const routes: Record<NavKey, string> = {
  home: '',
  about: '/chi-siamo',
  news: '/notizie',
  events: '/eventi',
  activities: '/attivita',
  gallery: '/galleria',
  donate: '/dona',
  join: '/associati',
  transparency: '/trasparenza',
  contact: '/contatti',
  privacy: '/privacy',
}

export const mainNav: NavKey[] = ['about', 'news', 'events', 'activities', 'gallery', 'contact']
export const footerExploreNav: NavKey[] = ['about', 'news', 'events', 'activities', 'gallery']
export const footerSupportNav: NavKey[] = ['donate', 'join', 'transparency', 'contact', 'privacy']

export function href(locale: Locale, path: string = '') {
  return `/${locale}${path}`
}

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/** OpenStreetMap embed: no API key and no tracking cookies. */
export function osmEmbedUrl({ lat, lng }: { lat: number; lng: number }) {
  const d = 0.008
  const bbox = [lng - d, lat - d / 1.6, lng + d, lat + d / 1.6].join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
}
