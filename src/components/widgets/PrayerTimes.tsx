'use client'

import { Clock, MoonStar } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { Dictionary } from '@/i18n/dictionaries'
import { cities, formatTime, getNextPrayer, getPrayerTimes, prayerNames, type City } from '@/lib/prayer'

type Labels = Dictionary['prayer']

/** Re-renders every 30 seconds. `null` until mounted, so server and client HTML match. */
function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the current time is only known in the browser
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

function CityTimes({
  city,
  name,
  now,
  labels,
  localeTag,
}: {
  city: City
  name: string
  now: Date | null
  labels: Labels
  localeTag: string
}) {
  const times = useMemo(() => (now ? getPrayerTimes(city, now) : null), [city, now])
  const next = times && now ? getNextPrayer(times, now) : null

  return (
    <div className="rounded-2xl bg-surface-raised p-5 ring-1 ring-border" data-testid={`prayer-${city.id}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold text-ink-heading">{name}</h3>
        <span className="font-mono text-sm text-ink-muted tabular-nums" dir="ltr">
          {now ? formatTime(now, city.timeZone, localeTag) : '--:--'}
        </span>
      </div>
      <ul className="mt-4 divide-y divide-surface-alt">
        {prayerNames.map((prayer) => {
          const isNext = prayer === next
          return (
            <li
              key={prayer}
              className={`flex items-center justify-between rounded-lg px-2 py-2 text-sm ${isNext ? 'bg-brand-soft font-semibold text-brand-soft-ink' : ''}`}
            >
              <span className="flex items-center gap-2">
                {labels[prayer]}
                {isNext && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] text-on-brand uppercase">{labels.next}</span>}
              </span>
              <span className="font-mono tabular-nums" dir="ltr">
                {times ? formatTime(times[prayer], city.timeZone, localeTag) : '--:--'}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function PrayerTimes({ labels, localeTag }: { labels: Labels; localeTag: string }) {
  const now = useNow()
  return (
    <div className="rounded-3xl bg-surface-alt p-6 ring-1 ring-border sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-on-brand">
            <MoonStar aria-hidden className="size-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-ink-heading">{labels.title}</h2>
            <p className="text-sm text-ink-muted">{labels.subtitle}</p>
          </div>
        </div>
        <p
          className="flex items-center gap-2 rounded-full bg-surface-raised px-4 py-2 text-sm font-medium ring-1 ring-border"
          data-testid="algeria-time"
        >
          <Clock aria-hidden className="size-4 text-brand" />
          {labels.timeInAlgeria}:
          <span className="font-mono font-semibold tabular-nums" dir="ltr">
            {now ? formatTime(now, cities.algiers.timeZone, localeTag) : '--:--'}
          </span>
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <CityTimes city={cities.brescia} name={labels.brescia} now={now} labels={labels} localeTag={localeTag} />
        <CityTimes city={cities.algiers} name={labels.algiers} now={now} labels={labels} localeTag={localeTag} />
      </div>
      <p className="mt-4 text-xs text-ink-muted">{labels.disclaimer}</p>
    </div>
  )
}
