import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { client } from './client'

type CacheProfile = 'minutes' | 'hours' | 'days' | 'max'

interface FetchOptions {
  query: string
  params?: Record<string, string | number | boolean>
  /** Document types the query reads. The Sanity webhook revalidates by `_type`. */
  tags: string[]
  /** Upper bound for staleness when no webhook arrives (e.g. "upcoming" lists). */
  revalidate?: CacheProfile
}

/**
 * The webhook only refreshes production. Preview deployments (dataset
 * `development`) re-fetch every few minutes instead.
 */
const isPreviewDeployment = !!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'

function applyCacheLife(profile: CacheProfile) {
  if (isPreviewDeployment) cacheLife('minutes')
  else if (profile === 'minutes') cacheLife('minutes')
  else if (profile === 'hours') cacheLife('hours')
  else if (profile === 'days') cacheLife('days')
  else cacheLife('max')
}

/**
 * Cached GROQ fetch. Returns `null` when Sanity is not configured or the
 * request fails, so every page can fall back to default content.
 */
export async function sanityFetch<T>({ query, params = {}, tags, revalidate = 'hours' }: FetchOptions): Promise<T | null> {
  'use cache'
  cacheTag('sanity', ...tags)

  if (!client) {
    cacheLife('max')
    return null
  }

  try {
    applyCacheLife(revalidate)
    return await client.fetch<T>(query, params)
  } catch (error) {
    console.error('[sanity] fetch failed', error)
    cacheLife('minutes')
    return null
  }
}
