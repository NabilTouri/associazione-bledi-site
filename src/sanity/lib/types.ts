import type { PortableTextBlock } from '@portabletext/react'

/** Result types for the GROQ queries in `queries.ts` (localized fields already resolved). */

export interface SanityImage {
  _type?: 'image'
  asset?: { _ref: string; _type?: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string | null
}

export type RuntsStatus = 'not_registered' | 'in_progress' | 'registered'

export interface SiteSettings {
  title: string | null
  tagline: string | null
  description: string | null
  email: string | null
  phone: string | null
  address: string | null
  mapQuery: string | null
  location: { lat: number; lng: number } | null
  social: { platform: string; url: string }[] | null
  runtsStatus: RuntsStatus | null
  runtsNumber: string | null
  fiscalCode: string | null
  iban: string | null
  donationsEnabled: boolean | null
  membershipFee: number | null
}

export interface HomePage {
  heroTitle: string | null
  heroSubtitle: string | null
  heroImage: SanityImage | null
  aboutTitle: string | null
  aboutText: string | null
  pillars: { title: string; text: string }[] | null
}

export interface AboutPage {
  intro: string | null
  mission: string | null
  story: PortableTextBlock[] | null
  values: { title: string; text: string }[] | null
  image: SanityImage | null
}

export type PostKind = 'news' | 'announcement'

export interface PostSummary {
  _id: string
  title: string
  slug: string
  kind: PostKind
  pinned: boolean | null
  publishedAt: string
  excerpt: string | null
  cover: SanityImage | null
}

export interface Post extends PostSummary {
  body: PortableTextBlock[] | null
}

export interface EventSummary {
  _id: string
  title: string
  slug: string
  start: string
  end: string | null
  locationName: string | null
  address: string | null
  excerpt: string | null
  cover: SanityImage | null
  isFree: boolean | null
}

export interface EventDetail extends EventSummary {
  body: PortableTextBlock[] | null
  registrationUrl: string | null
}

export type ActivityStatus = 'planned' | 'active' | 'paused'

export interface Activity {
  _id: string
  title: string
  category: string | null
  status: ActivityStatus
  schedule: string | null
  description: string | null
  image: SanityImage | null
}

export interface BoardMember {
  _id: string
  name: string
  role: string | null
  photo: SanityImage | null
}

export interface GalleryAlbumSummary {
  _id: string
  title: string
  slug: string
  date: string | null
  cover: SanityImage | null
  count: number
}

export interface GalleryAlbum extends GalleryAlbumSummary {
  description: string | null
  images: (SanityImage & { _key: string; caption?: string | null })[]
}

export type DocumentKind = 'statute' | 'deed' | 'budget' | 'report' | 'other'

export interface TransparencyDocument {
  _id: string
  title: string
  kind: DocumentKind
  year: number | null
  fileUrl: string | null
}

export interface LegalPage {
  title: string | null
  body: PortableTextBlock[] | null
}
