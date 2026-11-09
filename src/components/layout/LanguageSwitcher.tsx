'use client'

import { Check, ChevronDown, Languages } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import { localeNames, locales, type Locale } from '@/i18n/config'

/** Remembers the choice and swaps the locale segment of the URL. */
function goToLocale(pathname: string, next: Locale) {
  document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`
  const segments = pathname.split('/')
  segments[1] = next
  // Full navigation: <html lang/dir> and fonts change with the locale.
  window.location.assign(segments.join('/') || `/${next}`)
}

/**
 * Language menu (WAI-ARIA "listbox" pattern): a button opens a list of
 * languages; arrows move, Enter/Space choose, Esc closes, a click outside
 * closes. Choosing a language swaps the locale segment of the current URL.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname()
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => locales.indexOf(locale))

  const listId = `${id}-list`
  const optionId = (index: number) => `${id}-option-${index}`

  useEffect(() => {
    if (!open) return
    listRef.current?.focus()
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function openAt(index: number) {
    setActive(index)
    setOpen(true)
  }

  function close({ focusButton = true } = {}) {
    setOpen(false)
    if (focusButton) buttonRef.current?.focus()
  }

  function choose(next: Locale) {
    close()
    if (next !== locale) goToLocale(pathname, next)
  }

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openAt(locales.indexOf(locale))
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const last = locales.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((index) => (index === last ? 0 : index + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((index) => (index === 0 ? last : index - 1))
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(locales[active])
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Tab':
        close({ focusButton: false })
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${localeNames[locale]}`}
        onClick={() => (open ? close() : openAt(locales.indexOf(locale)))}
        onKeyDown={onButtonKeyDown}
        data-testid="language-switcher"
        className={`inline-flex h-10 items-center gap-1.5 rounded-full border bg-white ps-3 pe-2.5 text-sm font-medium text-ink transition-colors hover:border-primary-500 ${
          open ? 'border-primary-500 ring-3 ring-primary-100' : 'border-sand-300'
        }`}
      >
        <Languages aria-hidden className="size-4 text-primary-700" />
        <span className="hidden sm:inline" lang={locale}>
          {localeNames[locale]}
        </span>
        <span className="font-semibold uppercase sm:hidden">{locale}</span>
        <ChevronDown aria-hidden className={`size-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={optionId(active)}
          onKeyDown={onListKeyDown}
          data-testid="language-menu"
          className="absolute end-0 top-full z-50 mt-2 w-52 origin-top animate-pop-in overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 shadow-ink/10 ring-sand-200 focus:outline-none"
        >
          {locales.map((value, index) => {
            const selected = value === locale
            return (
              <li
                key={value}
                id={optionId(index)}
                role="option"
                aria-selected={selected}
                lang={value}
                onClick={() => choose(value)}
                onPointerMove={() => setActive(index)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm ${
                  index === active ? 'bg-sand-100' : ''
                } ${selected ? 'font-semibold text-primary-800' : 'text-ink'}`}
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`flex h-6 w-8 items-center justify-center rounded-md text-[11px] font-bold uppercase ${
                      selected ? 'bg-primary-600 text-white' : 'bg-sand-100 text-muted'
                    }`}
                  >
                    {value}
                  </span>
                  {localeNames[value]}
                </span>
                {selected && <Check aria-hidden className="size-4 text-primary-600" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
