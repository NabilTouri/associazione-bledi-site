import { Heart } from 'lucide-react'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { href, mainNav, routes } from '@/lib/site'

import { ButtonLink } from '../ui/ButtonLink'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { NavLink } from './NavLink'

export function Header({ locale, dict, siteName }: { locale: Locale; dict: Dictionary; siteName: string }) {
  const items = mainNav.map((key) => ({ key, label: dict.nav[key], href: href(locale, routes[key]) }))
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <Container className="flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
        <Link href={href(locale)} className="flex min-w-0 items-center gap-3 rounded-lg sm:gap-4">
          <Logo className="h-9 w-auto shrink-0 sm:h-11" title={siteName} />
          <span className="hidden max-w-40 border-s border-border ps-3 text-xs leading-snug text-ink-muted xl:block">
            {dict.meta.tagline}
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
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
