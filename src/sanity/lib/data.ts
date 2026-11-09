import 'server-only'

import type { Locale } from '@/i18n/config'

import { sanityFetch } from './fetch'
import {
  aboutPageQuery,
  donatePageQuery,
  activitiesQuery,
  boardMembersQuery,
  eventBySlugQuery,
  eventSlugsQuery,
  galleryAlbumBySlugQuery,
  galleryAlbumsQuery,
  homePageQuery,
  legalPageQuery,
  pastEventsQuery,
  postBySlugQuery,
  postSlugsQuery,
  postsQuery,
  siteSettingsQuery,
  transparencyDocumentsQuery,
  transparencyPageQuery,
  upcomingEventsQuery,
} from './queries'
import type {
  AboutPage,
  Activity,
  BoardMember,
  DonatePage,
  EventDetail,
  EventSummary,
  GalleryAlbum,
  GalleryAlbumSummary,
  HomePage,
  LegalPage,
  Post,
  PostSummary,
  SiteSettings,
  TransparencyDocument,
  TransparencyPage,
} from './types'

/**
 * One function per content need. Cache tags are the Sanity document types,
 * so publishing a document refreshes every page that shows that type.
 */

export const getSiteSettings = (locale: Locale) =>
  sanityFetch<SiteSettings>({ query: siteSettingsQuery, params: { locale }, tags: ['siteSettings'], revalidate: 'max' })

export const getHomePage = (locale: Locale) =>
  sanityFetch<HomePage>({ query: homePageQuery, params: { locale }, tags: ['homePage'], revalidate: 'max' })

export const getAboutPage = (locale: Locale) =>
  sanityFetch<AboutPage>({ query: aboutPageQuery, params: { locale }, tags: ['aboutPage'], revalidate: 'max' })

export const getDonatePage = (locale: Locale) =>
  sanityFetch<DonatePage>({ query: donatePageQuery, params: { locale }, tags: ['donatePage'], revalidate: 'max' })

export const getTransparencyPage = (locale: Locale) =>
  sanityFetch<TransparencyPage>({ query: transparencyPageQuery, params: { locale }, tags: ['transparencyPage'], revalidate: 'max' })

export const getPosts = async (locale: Locale, limit = 50) =>
  (await sanityFetch<PostSummary[]>({ query: postsQuery, params: { locale, limit }, tags: ['post'], revalidate: 'max' })) ?? []

export const getPost = (locale: Locale, slug: string) =>
  sanityFetch<Post>({ query: postBySlugQuery, params: { locale, slug }, tags: ['post'], revalidate: 'max' })

export const getPostSlugs = async () => (await sanityFetch<string[]>({ query: postSlugsQuery, tags: ['post'], revalidate: 'max' })) ?? []

// Event lists depend on the current time, so they also refresh hourly.
export const getUpcomingEvents = async (locale: Locale, limit = 50) =>
  (await sanityFetch<EventSummary[]>({ query: upcomingEventsQuery, params: { locale, limit }, tags: ['event'], revalidate: 'hours' })) ?? []

export const getPastEvents = async (locale: Locale, limit = 24) =>
  (await sanityFetch<EventSummary[]>({ query: pastEventsQuery, params: { locale, limit }, tags: ['event'], revalidate: 'hours' })) ?? []

export const getEvent = (locale: Locale, slug: string) =>
  sanityFetch<EventDetail>({ query: eventBySlugQuery, params: { locale, slug }, tags: ['event'], revalidate: 'max' })

export const getEventSlugs = async () => (await sanityFetch<string[]>({ query: eventSlugsQuery, tags: ['event'], revalidate: 'max' })) ?? []

export const getActivities = async (locale: Locale) =>
  (await sanityFetch<Activity[]>({ query: activitiesQuery, params: { locale }, tags: ['activity'], revalidate: 'max' })) ?? []

export const getBoardMembers = async (locale: Locale) =>
  (await sanityFetch<BoardMember[]>({ query: boardMembersQuery, params: { locale }, tags: ['boardMember'], revalidate: 'max' })) ?? []

export const getGalleryAlbums = async (locale: Locale) =>
  (await sanityFetch<GalleryAlbumSummary[]>({
    query: galleryAlbumsQuery,
    params: { locale },
    tags: ['galleryAlbum'],
    revalidate: 'max',
  })) ?? []

export const getGalleryAlbum = (locale: Locale, slug: string) =>
  sanityFetch<GalleryAlbum>({ query: galleryAlbumBySlugQuery, params: { locale, slug }, tags: ['galleryAlbum'], revalidate: 'max' })

export const getTransparencyDocuments = async (locale: Locale) =>
  (await sanityFetch<TransparencyDocument[]>({
    query: transparencyDocumentsQuery,
    params: { locale },
    tags: ['transparencyDocument'],
    revalidate: 'max',
  })) ?? []

export const getLegalPage = (locale: Locale, slug: string) =>
  sanityFetch<LegalPage>({ query: legalPageQuery, params: { locale, slug }, tags: ['legalPage'], revalidate: 'max' })

/** Placeholder slug so `generateStaticParams` is never empty (required by Cache Components). */
export const PLACEHOLDER_SLUG = '__placeholder__'
export const slugParams = (slugs: string[]) => (slugs.length ? slugs : [PLACEHOLDER_SLUG]).map((slug) => ({ slug }))
