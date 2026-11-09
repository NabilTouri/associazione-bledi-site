import { CalendarDays, MapPin } from 'lucide-react'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import { formatDate, formatEventRange } from '@/lib/format'
import { href } from '@/lib/site'
import type { EventSummary } from '@/sanity/lib/types'

import { SanityImage } from './SanityImage'

export function EventCard({ event, locale, freeLabel }: { event: EventSummary; locale: Locale; freeLabel: string }) {
  const day = formatDate(event.start, locale, { day: '2-digit' })
  const month = formatDate(event.start, locale, { month: 'short' })
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-sand-200 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/9] bg-primary-50">
        <SanityImage
          image={event.cover}
          width={800}
          height={450}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover"
        />
        <div className="absolute start-4 top-4 flex flex-col items-center rounded-2xl bg-white px-3 py-2 text-center shadow-sm">
          <span className="text-2xl leading-none font-bold text-primary-700">{day}</span>
          <span className="text-xs font-semibold text-muted uppercase">{month}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl font-bold text-primary-900">
          <Link href={href(locale, `/eventi/${event.slug}`)} className="after:absolute after:inset-0">
            {event.title}
          </Link>
        </h3>
        {event.excerpt && <p className="line-clamp-3 text-muted">{event.excerpt}</p>}
        <dl className="mt-auto space-y-1.5 text-sm text-muted">
          <div className="flex items-center gap-2">
            <CalendarDays aria-hidden className="size-4 text-primary-600" />
            <dd>{formatEventRange(event.start, event.end, locale)}</dd>
          </div>
          {(event.locationName || event.address) && (
            <div className="flex items-center gap-2">
              <MapPin aria-hidden className="size-4 text-primary-600" />
              <dd>{[event.locationName, event.address].filter(Boolean).join(', ')}</dd>
            </div>
          )}
        </dl>
        {event.isFree && (
          <span className="self-start rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{freeLabel}</span>
        )}
      </div>
    </article>
  )
}
