'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function NavLink({
  href,
  children,
  onNavigate,
  variant = 'desktop',
}: {
  href: string
  children: ReactNode
  onNavigate?: () => void
  variant?: 'desktop' | 'mobile'
}) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(`${href}/`)

  if (variant === 'mobile') {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={`flex min-h-12 items-center justify-between gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-colors ${
          active ? 'bg-primary-50 text-primary-800' : 'text-ink hover:bg-sand-100'
        }`}
      >
        <span className="flex items-center gap-3">
          <span aria-hidden className={`h-5 w-1 rounded-full ${active ? 'bg-primary-600' : 'bg-transparent'}`} />
          {children}
        </span>
        <ChevronRight aria-hidden className={`size-4 rtl:rotate-180 ${active ? 'text-primary-600' : 'text-sand-300'}`} />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`block rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-primary-50 text-primary-800' : 'text-ink/80 hover:bg-sand-100 hover:text-primary-800'
      }`}
    >
      {children}
    </Link>
  )
}
