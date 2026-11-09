'use client'

import { Heart, Menu, UserPlus, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'

import { buttonClasses } from '../ui/ButtonLink'
import { Logo } from '../ui/Logo'
import { NavLink } from './NavLink'

interface Item {
  key: string
  label: string
  href: string
}

/**
 * Side panel menu for small screens. It slides in from the end side (left in
 * Arabic), keeps keyboard focus inside while open and gives it back to the
 * menu button when closed.
 */
export function MobileMenu({
  siteName,
  items,
  join,
  donate,
  labels,
}: {
  siteName: string
  items: Item[]
  join: { label: string; href: string }
  donate: { label: string; href: string }
  labels: { open: string; close: string }
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }
    if (event.key !== 'Tab' || !panelRef.current) return
    // Keep focus inside the panel.
    const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={labels.open}
        data-testid="mobile-menu-button"
        className="inline-flex size-10 items-center justify-center rounded-full border border-border-control bg-surface-raised text-ink-heading transition-colors hover:border-brand"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      {open &&
        // Rendered in <body>: the sticky header's backdrop-filter would otherwise
        // become the containing block of this fixed overlay.
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={labels.open}
            className="fixed inset-0 z-50"
            onKeyDown={onKeyDown}
          >
            <div aria-hidden className="absolute inset-0 animate-fade-in bg-surface-deep/40 backdrop-blur-sm" onClick={close} />
            <div
              ref={panelRef}
              data-testid="mobile-menu-panel"
              className="absolute inset-y-0 end-0 flex w-full max-w-sm animate-slide-in flex-col bg-surface shadow-2xl sm:rounded-s-3xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <Logo className="h-9 w-auto" title={siteName} />
                <button
                  type="button"
                  onClick={close}
                  data-autofocus
                  aria-label={labels.close}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border-control bg-surface-raised transition-colors hover:border-brand"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>
              <nav aria-label={labels.open} className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.key}>
                      <NavLink href={item.href} onNavigate={() => setOpen(false)} variant="mobile">
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="grid gap-3 border-t border-border p-5">
                <Link href={join.href} onClick={() => setOpen(false)} className={buttonClasses('secondary', 'w-full py-3')}>
                  <UserPlus aria-hidden className="size-4" />
                  {join.label}
                </Link>
                <Link href={donate.href} onClick={() => setOpen(false)} className={buttonClasses('accent', 'w-full py-3')}>
                  <Heart aria-hidden className="size-4" />
                  {donate.label}
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
