/**
 * Sanity Studio, available at /studio.
 * All routes under /studio are handled by the Studio's own router.
 */
import { NextStudio } from 'next-sanity/studio'

import config from '../../../../sanity.config'

export { metadata, viewport } from 'next-sanity/studio'

export function generateStaticParams() {
  return [{ tool: [] }]
}

export default function StudioPage() {
  return <NextStudio config={config} />
}
