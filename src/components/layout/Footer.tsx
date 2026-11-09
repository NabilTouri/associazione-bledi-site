import { Mail, MapPin, Phone } from 'lucide-react'
import { cacheLife } from 'next/cache'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { footerExploreNav, footerSupportNav, href, mapsUrl, routes, type ResolvedSettings } from '@/lib/site'

import { Container } from '../ui/Container'
import { LogoMark } from '../ui/Logo'

async function CurrentYear() {
  'use cache'
  cacheLife('days')
  return <>{new Date().getFullYear()}</>
}

export function Footer({ locale, dict, settings }: { locale: Locale; dict: Dictionary; settings: ResolvedSettings }) {
  const column = (title: string, keys: typeof footerExploreNav) => (
    <div>
      <h2 className="text-sm font-semibold tracking-wide text-white uppercase">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {keys.map((key) => (
          <li key={key}>
            <Link href={href(locale, routes[key])} className="inline-block py-0.5 text-primary-100/80 hover:text-white">
              {dict.nav[key]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <footer className="mt-auto bg-primary-900 text-primary-100">
      <div aria-hidden className="h-1.5 bg-gradient-to-r from-primary-500 via-white to-accent-500" />
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-4">
        <div className="col-span-2 space-y-4 lg:col-span-1">
          <div className="flex items-center gap-3">
            <LogoMark className="size-11" />
            <span className="font-display text-xl font-bold text-white">{settings.title}</span>
          </div>
          <p className="text-primary-100/80">{dict.footer.aboutText}</p>
        </div>
        {column(dict.footer.explore, footerExploreNav)}
        {column(dict.footer.support, footerSupportNav)}
        <div className="col-span-2 lg:col-span-1">
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">{dict.footer.contacts}</h2>
          <ul className="mt-4 space-y-3 text-primary-100/80">
            <li className="flex gap-2">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
              <a href={mapsUrl(settings.mapQuery)} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {settings.address}
              </a>
            </li>
            {settings.email && (
              <li className="flex gap-2">
                <Mail aria-hidden className="mt-0.5 size-4 shrink-0" />
                <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li className="flex gap-2">
                <Phone aria-hidden className="mt-0.5 size-4 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-white" dir="ltr">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.social.map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {item.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-6 text-sm text-primary-100/60">
          © <CurrentYear /> {settings.title}. {dict.footer.rights}
        </Container>
      </div>
    </footer>
  )
}
