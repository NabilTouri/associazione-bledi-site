import { createImageUrlBuilder } from '@sanity/image-url'

import { dataset, projectId } from '../env'
import type { SanityImage } from './types'

const builder = createImageUrlBuilder({ projectId: projectId || 'missing', dataset })

export function urlForImage(image: SanityImage) {
  return builder.image(image).auto('format').fit('max')
}
