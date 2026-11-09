import { Heart } from 'lucide-react'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { href, mainNav, routes } from '@/lib/site'

import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { LogoMark } from '../ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { NavLink } from './NavLink'

export function Header({ locale, dict, siteName }: { locale: Locale; dict: Dictionary; siteName: string }) {
  const items = mainNav.map((key) => ({ key, label: dict.nav[key], href: href(locale, routes[key]) }))
  return (
    <header className="sticky top-0 z-40 border-b border-sand-200/80 bg-sand-50/90 backdrop-blur supports-[backdrop-filter]:bg-sand-50/75">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href={href(locale)} className="flex items-center gap-3 rounded-lg">
          <LogoMark className="size-10 sm:size-11" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-primary-900">{siteName}</span>
            <span className="hidden text-xs text-muted sm:block">{dict.meta.tagline}</span>
          </span>
        </Link>

        <nav aria-label={dict.nav.menu} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.key}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={dict.nav.language} />
          <div className="hidden sm:block">
            <ButtonLink href={href(locale, routes.donate)} variant="accent">
              <Heart aria-hidden className="size-4" />
              {dict.nav.donate}
            </ButtonLink>
          </div>
          <MobileMenu
            siteName={siteName}
            items={[{ key: 'home', label: dict.nav.home, href: href(locale) }, ...items]}
            join={{ label: dict.nav.join, href: href(locale, routes.join) }}
            donate={{ label: dict.nav.donate, href: href(locale, routes.donate) }}
            labels={{ open: dict.nav.menu, close: dict.nav.close }}
          />
        </div>
      </Container>
    </header>
  )
}
