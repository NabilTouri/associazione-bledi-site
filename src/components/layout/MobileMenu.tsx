'use client'

import { Heart, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { buttonClasses } from '../ui/ButtonLink'
import { NavLink } from './NavLink'

interface Item {
  key: string
  label: string
  href: string
}

export function MobileMenu({
  items,
  donate,
  labels,
}: {
  items: Item[]
  donate: { label: string; href: string }
  labels: { open: string; close: string }
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex size-10 items-center justify-center rounded-full text-primary-900 hover:bg-sand-100"
      >
        <Menu aria-hidden className="size-6" />
        <span className="sr-only">{labels.open}</span>
      </button>

      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={labels.open} className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label={labels.close}
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 end-0 flex w-full max-w-xs flex-col bg-sand-50 p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ms-auto inline-flex size-10 items-center justify-center rounded-full hover:bg-sand-100"
              autoFocus
            >
              <X aria-hidden className="size-6" />
              <span className="sr-only">{labels.close}</span>
            </button>
            <nav className="mt-4 flex-1">
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.key}>
                    <NavLink href={item.href} onNavigate={() => setOpen(false)}>
                      <span className="text-base">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <Link href={donate.href} onClick={() => setOpen(false)} className={buttonClasses('accent', 'w-full')}>
              <Heart aria-hidden className="size-4" />
              {donate.label}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
