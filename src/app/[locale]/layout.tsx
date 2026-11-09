import '../globals.css'

import type { Metadata, Viewport } from 'next'
import { Fraunces, Noto_Kufi_Arabic, Plus_Jakarta_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getDirection, isLocale, localeTags, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { resolveSettings, siteUrl } from '@/lib/site'
import { getSiteSettings } from '@/sanity/lib/data'

const latin = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-latin', display: 'swap' })
const displayLatin = Fraunces({ subsets: ['latin'], variable: '--font-display-latin', display: 'swap' })
const arabic = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-arabic', display: 'swap' })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#0c6b3c',
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const settings = resolveSettings(await getSiteSettings(locale), dict)
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${settings.title} · ${settings.tagline}`, template: `%s · ${settings.title}` },
    description: settings.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}`])),
    },
    openGraph: {
      type: 'website',
      siteName: settings.title,
      locale: localeTags[locale].replace('-', '_'),
      title: settings.title,
      description: settings.description,
    },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const settings = resolveSettings(await getSiteSettings(locale), dict)

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${latin.variable} ${displayLatin.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-primary-700 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {dict.nav.skipToContent}
        </a>
        <Header locale={locale} dict={dict} siteName={settings.title} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} settings={settings} />
      </body>
    </html>
  )
}
