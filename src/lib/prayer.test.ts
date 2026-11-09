import { describe, expect, it } from 'vitest'

import { cities, formatTime, getNextPrayer, getPrayerTimes, prayerNames } from './prayer'

// Midday UTC, so the calendar day is the same in Brescia and Algiers.
const day = new Date('2026-06-21T12:00:00Z')

describe.each(Object.values(cities))('getPrayerTimes($id)', (city) => {
  const times = getPrayerTimes(city, day)

  it('returns the prayers in chronological order', () => {
    const values = prayerNames.map((name) => times[name].getTime())
    expect(values).toEqual([...values].sort((a, b) => a - b))
  })

  it('computes times for the requested local day', () => {
    const localDay = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: city.timeZone }).format(date)
    for (const name of prayerNames) expect(localDay(times[name])).toBe('2026-06-21')
  })

  it('puts Dhuhr around local solar noon', () => {
    const [hours] = formatTime(times.dhuhr, city.timeZone, 'it-IT').split(':').map(Number)
    expect(hours).toBeGreaterThanOrEqual(12)
    expect(hours).toBeLessThanOrEqual(14)
  })
})

describe('getNextPrayer', () => {
  const times = getPrayerTimes(cities.brescia, day)

  it('skips sunrise', () => {
    const afterFajr = new Date(times.fajr.getTime() + 60_000)
    expect(getNextPrayer(times, afterFajr)).toBe('dhuhr')
  })

  it('returns null after Isha', () => {
    expect(getNextPrayer(times, new Date(times.isha.getTime() + 60_000))).toBeNull()
  })
})
