import { CalculationMethod, Coordinates, Madhab, PrayerTimes, type CalculationParameters } from 'adhan'

export const prayerNames = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
export type PrayerName = (typeof prayerNames)[number]

export interface City {
  id: 'brescia' | 'algiers'
  latitude: number
  longitude: number
  timeZone: string
  params: () => CalculationParameters
}

/** Algerian Ministry of Religious Affairs: Fajr 18°, Isha 17°, Maghrib +3 min. */
function algeriaParams(): CalculationParameters {
  const params = CalculationMethod.Other()
  params.fajrAngle = 18
  params.ishaAngle = 17
  params.methodAdjustments.maghrib = 3
  params.madhab = Madhab.Shafi
  return params
}

export const cities: Record<City['id'], City> = {
  brescia: {
    id: 'brescia',
    latitude: 45.5416,
    longitude: 10.2118,
    timeZone: 'Europe/Rome',
    params: () => {
      const params = CalculationMethod.MuslimWorldLeague()
      params.madhab = Madhab.Shafi
      return params
    },
  },
  algiers: {
    id: 'algiers',
    latitude: 36.7538,
    longitude: 3.0588,
    timeZone: 'Africa/Algiers',
    params: algeriaParams,
  },
}

export type DailyPrayerTimes = Record<PrayerName, Date>

/**
 * Prayer times for the calendar day `date` in the city's own time zone.
 * `date` only provides the year/month/day as seen in that time zone.
 */
export function getPrayerTimes(city: City, date: Date): DailyPrayerTimes {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: city.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .split('-')
    .map(Number)
  // adhan reads only the calendar components of this local Date.
  const localDay = new Date(year, month - 1, day)
  const times = new PrayerTimes(new Coordinates(city.latitude, city.longitude), localDay, city.params())
  return {
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
  }
}

/** Next prayer after `now` (sunrise excluded), or `null` after Isha. */
export function getNextPrayer(times: DailyPrayerTimes, now: Date): PrayerName | null {
  return prayerNames.find((name) => name !== 'sunrise' && times[name].getTime() > now.getTime()) ?? null
}

export function formatTime(date: Date, timeZone: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date)
}
