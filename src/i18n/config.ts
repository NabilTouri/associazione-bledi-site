export const locales = ['it', 'ar', 'fr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'it'

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  ar: 'العربية',
  fr: 'Français',
}

/** BCP 47 tags used for date/number formatting. */
export const localeTags: Record<Locale, string> = {
  it: 'it-IT',
  ar: 'ar-DZ',
  fr: 'fr-FR',
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}
