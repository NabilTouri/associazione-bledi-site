'use client'

import { Languages } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { localeNames, locales, type Locale } from '@/i18n/config'

/** Swaps the locale segment of the current URL and remembers the choice. */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname()

  function change(next: Locale) {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`
    const segments = pathname.split('/')
    segments[1] = next
    // Full navigation: <html lang/dir> and fonts change with the locale.
    window.location.assign(segments.join('/') || `/${next}`)
  }

  return (
    <label className="relative flex items-center">
      <span className="sr-only">{label}</span>
      <Languages aria-hidden className="pointer-events-none absolute start-2.5 size-4 text-primary-700" />
      <select
        value={locale}
        onChange={(event) => change(event.target.value as Locale)}
        className="cursor-pointer appearance-none rounded-full border border-sand-300 bg-white py-2 ps-8 pe-3 text-sm font-medium text-ink hover:border-primary-500"
        data-testid="language-switcher"
      >
        {locales.map((value) => (
          <option key={value} value={value} lang={value}>
            {localeNames[value]}
          </option>
        ))}
      </select>
    </label>
  )
}
