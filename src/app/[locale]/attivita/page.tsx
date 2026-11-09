import { Clock } from 'lucide-react'
import type { Metadata } from 'next'

import { SanityImage } from '@/components/content/SanityImage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { href, routes } from '@/lib/site'
import { getActivities } from '@/sanity/lib/data'
import type { Activity, ActivityStatus } from '@/sanity/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.activities.title, description: dict.activities.intro }
}

const statusStyles: Record<ActivityStatus, string> = {
  planned: 'bg-amber-100 text-amber-800',
  active: 'bg-primary-100 text-primary-800',
  paused: 'bg-sand-200 text-muted',
}

export default async function ActivitiesPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const fromCms = await getActivities(locale)

  // Until activities are entered in Sanity, show the planned ones from the dictionary.
  const activities: Activity[] = fromCms.length
    ? fromCms
    : dict.activities.items.map((item, index) => ({
        _id: `planned-${index}`,
        title: item.title,
        category: item.category,
        status: 'planned',
        schedule: null,
        description: item.text,
        image: null,
      }))
  const someNotActive = activities.some((activity) => activity.status !== 'active')

  return (
    <>
      <PageHeader title={dict.activities.title} intro={dict.activities.intro} />
      <Section>
        {someNotActive && (
          <Notice variant="soon" title={dict.activities.noticeTitle} className="mb-10">
            {dict.activities.notice}
          </Notice>
        )}
        <ul className="grid gap-6 sm:grid-cols-2">
          {activities.map((activity) => (
            <li
              key={activity._id}
              data-status={activity.status}
              className={`flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-sand-200 ${activity.status === 'active' ? '' : 'border-2 border-dashed border-sand-300 ring-0'}`}
            >
              {activity.image?.asset && (
                <SanityImage
                  image={activity.image}
                  width={800}
                  height={400}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="aspect-[2/1] w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  {activity.category && <span className="rounded-full bg-sand-100 px-3 py-1 text-muted">{activity.category}</span>}
                  <span className={`rounded-full px-3 py-1 ${statusStyles[activity.status]}`}>
                    {dict.activities.status[activity.status]}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-primary-900">{activity.title}</h2>
                {activity.description && <p className="leading-relaxed text-muted">{activity.description}</p>}
                {activity.schedule && (
                  <p className="mt-auto flex items-center gap-2 text-sm font-medium">
                    <Clock aria-hidden className="size-4 text-primary-600" />
                    {activity.schedule}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl bg-primary-50 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-900">{dict.activities.proposeTitle}</h2>
            <p className="mt-1 text-muted">{dict.activities.proposeText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={href(locale, routes.join)}>{dict.nav.join}</ButtonLink>
            <ButtonLink href={href(locale, routes.contact)} variant="secondary">
              {dict.nav.contact}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}
