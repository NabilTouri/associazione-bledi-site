import type { Metadata } from 'next'

import { EventCard } from '@/components/content/EventCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { getPastEvents, getUpcomingEvents } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.events.title, description: dict.events.intro }
}

export default async function EventsPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const [upcoming, past] = await Promise.all([getUpcomingEvents(locale), getPastEvents(locale)])

  return (
    <>
      <PageHeader title={dict.events.title} intro={dict.events.intro} />
      <Section id="upcoming" title={dict.events.upcoming}>
        {upcoming.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event._id} event={event} locale={locale} freeLabel={dict.common.free} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-white p-10 text-center text-muted ring-1 ring-sand-200">{dict.events.empty}</p>
        )}
      </Section>
      {past.length > 0 && (
        <Section id="past" title={dict.events.past} className="bg-white">
          <div className="grid gap-6 opacity-90 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event._id} event={event} locale={locale} freeLabel={dict.common.free} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
