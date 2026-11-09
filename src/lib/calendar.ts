export interface CalendarEvent {
  title: string
  start: string
  end?: string | null
  location?: string | null
  description?: string | null
  url?: string
}

const TWO_HOURS = 2 * 60 * 60 * 1000

/** `20261109T183000Z` */
function toUtcStamp(value: string | Date): string {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/[,;]/g, (m) => `\\${m}`)
}

function endOf(event: CalendarEvent): string {
  return event.end ?? new Date(new Date(event.start).getTime() + TWO_HOURS).toISOString()
}

/** RFC 5545 calendar file with a single event. */
export function buildIcs(event: CalendarEvent, uid: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Associazione Bledi//Sito//IT',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}@associazione-bledi`,
    `DTSTAMP:${toUtcStamp(event.start)}`,
    `DTSTART:${toUtcStamp(event.start)}`,
    `DTEND:${toUtcStamp(endOf(event))}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    event.location ? `LOCATION:${escapeIcs(event.location)}` : null,
    event.description ? `DESCRIPTION:${escapeIcs(event.description)}` : null,
    event.url ? `URL:${event.url}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.filter(Boolean).join('\r\n')
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toUtcStamp(event.start)}/${toUtcStamp(endOf(event))}`,
  })
  if (event.location) params.set('location', event.location)
  if (event.description) params.set('details', event.description)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
