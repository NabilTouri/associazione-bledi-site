'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function NavLink({ href, children, onNavigate }: { href: string; children: ReactNode; onNavigate?: () => void }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(`${href}/`)
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
