import { notFound } from 'next/navigation'
import { locale as rootLocale } from 'next/root-params'

import ar from '@/messages/ar.json'
import fr from '@/messages/fr.json'
import it from '@/messages/it.json'

import { isLocale, type Locale } from './config'

/** Italian is the source of truth: the other files must have the same shape. */
export type Dictionary = typeof it

const dictionaries: Record<Locale, Dictionary> = { it, ar, fr }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

/** Reads the `[locale]` root segment. Server Components only. */
export async function getLocale(): Promise<Locale> {
  const value = await rootLocale()
  if (!isLocale(value)) notFound()
  return value
}
