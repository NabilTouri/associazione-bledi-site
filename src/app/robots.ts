import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must not be indexed.
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : true
  return {
    rules: isProduction ? { userAgent: '*', allow: '/', disallow: ['/studio', '/api'] } : { userAgent: '*', disallow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
