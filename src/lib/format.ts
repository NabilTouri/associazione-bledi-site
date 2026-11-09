import { localeTags, type Locale } from '@/i18n/config'

/** All dates on the site are shown in Brescia's time zone. */
export const SITE_TIME_ZONE = 'Europe/Rome'

export function formatDate(value: string | Date, locale: Locale, options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }) {
  return new Intl.DateTimeFormat(localeTags[locale], { timeZone: SITE_TIME_ZONE, ...options }).format(new Date(value))
}

export function formatDateTime(value: string | Date, locale: Locale) {
  return formatDate(value, locale, { dateStyle: 'full', timeStyle: 'short' })
}

export function formatEventRange(start: string, end: string | null, locale: Locale) {
  if (!end) return formatDateTime(start, locale)
  const sameDay = formatDate(start, locale, { dateStyle: 'short' }) === formatDate(end, locale, { dateStyle: 'short' })
  return sameDay
    ? `${formatDateTime(start, locale)} – ${formatDate(end, locale, { timeStyle: 'short' })}`
    : `${formatDateTime(start, locale)} – ${formatDateTime(end, locale)}`
}

export function formatCurrency(amount: number, locale: Locale) {
  return new Intl.NumberFormat(localeTags[locale], {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}
