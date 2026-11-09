import type { SchemaTypeDefinition } from 'sanity'

import { activity, boardMember, event, galleryAlbum, legalPage, post, transparencyDocument } from './documents/content'
import { donatePage, transparencyPage } from './documents/pages'
import { aboutPage, homePage, siteSettings } from './documents/singletons'
import { submission } from './documents/submission'
import { blockContent, localeBlockContent, localeString, localeText } from './objects/localized'

export const singletonTypes = new Set(['siteSettings', 'homePage', 'aboutPage', 'donatePage', 'transparencyPage'])

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  blockContent,
  localeString,
  localeText,
  localeBlockContent,
  // singletons
  siteSettings,
  homePage,
  aboutPage,
  donatePage,
  transparencyPage,
  // collections
  post,
  event,
  activity,
  galleryAlbum,
  boardMember,
  transparencyDocument,
  legalPage,
  submission,
]
