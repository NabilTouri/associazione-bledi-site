/**
 * Sanity connection settings. All values are public (they end up in the
 * browser for the Studio), secrets live in server-only env vars instead.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-10-01'

/** False until the Sanity project is created and its id is set on Vercel / `.env.local`. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId)
