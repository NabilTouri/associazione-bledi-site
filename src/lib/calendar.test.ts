import { describe, expect, it } from 'vitest'

import { buildIcs, googleCalendarUrl } from './calendar'

const event = {
  title: 'Festa dell’indipendenza; musica, cous cous',
  start: '2026-07-05T16:00:00.000Z',
  end: '2026-07-05T20:30:00.000Z',
  location: 'Via Roma 1, Brescia',
  description: 'Riga 1\nRiga 2',
}

describe('buildIcs', () => {
  const ics = buildIcs(event, 'abc123')

  it('produces a valid VEVENT with UTC times', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(ics).toContain('DTSTART:20260705T160000Z')
    expect(ics).toContain('DTEND:20260705T203000Z')
    expect(ics).toContain('UID:abc123@associazione-bledi')
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true)
  })

  it('escapes commas, semicolons and newlines', () => {
    expect(ics).toContain('SUMMARY:Festa dell’indipendenza\\; musica\\, cous cous')
    expect(ics).toContain('DESCRIPTION:Riga 1\\nRiga 2')
  })

  it('defaults to a two hour event when no end is given', () => {
    expect(buildIcs({ ...event, end: null }, 'x')).toContain('DTEND:20260705T180000Z')
  })
})

describe('googleCalendarUrl', () => {
  it('encodes title, dates and location', () => {
    const url = new URL(googleCalendarUrl(event))
    expect(url.hostname).toBe('calendar.google.com')
    expect(url.searchParams.get('text')).toBe(event.title)
    expect(url.searchParams.get('dates')).toBe('20260705T160000Z/20260705T203000Z')
    expect(url.searchParams.get('location')).toBe(event.location)
  })
})
