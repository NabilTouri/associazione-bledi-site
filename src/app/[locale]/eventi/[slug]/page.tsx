import { ArrowLeft, CalendarDays, CalendarPlus, Download, ExternalLink, MapPin, Ticket } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/content/RichText'
import { SanityImage } from '@/components/content/SanityImage'
import { buttonClasses } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildIcs, googleCalendarUrl, type CalendarEvent } from '@/lib/calendar'
import { formatEventRange } from '@/lib/format'
import { href, mapsUrl, routes, siteUrl } from '@/lib/site'
import { getEvent, getEventSlugs, slugParams } from '@/sanity/lib/data'
import { urlForImage } from '@/sanity/lib/image'

export async function generateStaticParams() {
  return slugParams(await getEventSlugs())
}

async function load(params: PageProps<'/[locale]/eventi/[slug]'>['params']) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const event = await getEvent(locale, slug)
  if (!event) notFound()
  return { locale, event }
}

export async function generateMetadata({ params }: PageProps<'/[locale]/eventi/[slug]'>): Promise<Metadata> {
  const { event } = await load(params)
  return {
    title: event.title,
    description: event.excerpt ?? undefined,
    openGraph: {
      images: event.cover?.asset ? [urlForImage(event.cover).width(1200).height(630).fit('crop').url()] : undefined,
    },
  }
}

export default async function EventPage({ params }: PageProps<'/[locale]/eventi/[slug]'>) {
  const { locale, event } = await load(params)
  const dict = getDictionary(locale)
  const place = [event.locationName, event.address].filter(Boolean).join(', ')
  const calendarEvent: CalendarEvent = {
    title: event.title,
    start: event.start,
    end: event.end,
    location: place || null,
    description: event.excerpt,
    url: `${siteUrl}${href(locale, `/eventi/${event.slug}`)}`,
  }
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(calendarEvent, event._id))}`

  // Structured data so search engines can show the event.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.start,
    endDate: event.end ?? undefined,
    description: event.excerpt ?? undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: place ? { '@type': 'Place', name: event.locationName ?? place, address: event.address ?? place } : undefined,
    organizer: { '@type': 'Organization', name: dict.meta.siteName, url: siteUrl },
    isAccessibleForFree: event.isFree ?? undefined,
  }

  return (
    <article className="pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="border-b border-sand-200 bg-sand-100">
        <Container className="py-12 sm:py-16">
          <Link
            href={href(locale, routes.events)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
            {dict.events.title}
          </Link>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl">{event.title}</h1>
          {event.excerpt && <p className="mt-4 max-w-2xl text-xl leading-relaxed text-muted">{event.excerpt}</p>}
        </Container>
      </header>

      <Container className="grid gap-10 pt-10 lg:grid-cols-[1fr_340px]">
        <div>
          {event.cover?.asset && (
            <SanityImage
              image={event.cover}
              width={1400}
              height={790}
              priority
              sizes="(min-width: 1024px) 720px, 100vw"
              className="mb-10 w-full rounded-3xl"
            />
          )}
          <div className="text-lg">
            <RichText value={event.body} />
          </div>
        </div>

        <aside className="h-fit space-y-5 rounded-3xl bg-white p-6 ring-1 ring-sand-200 lg:sticky lg:top-28">
          <div className="flex gap-3">
            <CalendarDays aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-600" />
            <div>
              <p className="text-sm font-semibold text-muted">{dict.common.when}</p>
              <p className="font-medium">{formatEventRange(event.start, event.end, locale)}</p>
            </div>
          </div>
          {place && (
            <div className="flex gap-3">
              <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-600" />
              <div>
                <p className="text-sm font-semibold text-muted">{dict.common.where}</p>
                <a
                  href={mapsUrl(place)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {place}
                </a>
              </div>
            </div>
          )}
          {event.isFree && (
            <div className="flex gap-3">
              <Ticket aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-600" />
              <p className="font-medium">{dict.common.free}</p>
            </div>
          )}
          {event.registrationUrl && (
            <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('accent', 'w-full')}>
              {dict.common.register}
              <ExternalLink aria-hidden className="size-4" />
            </a>
          )}
          <div className="space-y-2 border-t border-sand-200 pt-5">
            <p className="text-sm font-semibold text-muted">{dict.common.addToCalendar}</p>
            <a
              href={googleCalendarUrl(calendarEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses('secondary', 'w-full')}
            >
              <CalendarPlus aria-hidden className="size-4" />
              {dict.common.googleCalendar}
            </a>
            <a href={icsHref} download={`${event.slug}.ics`} className={buttonClasses('secondary', 'w-full')}>
              <Download aria-hidden className="size-4" />
              {dict.common.downloadIcs}
            </a>
          </div>
        </aside>
      </Container>
    </article>
  )
}
