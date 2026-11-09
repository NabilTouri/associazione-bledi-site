import { describe, expect, it } from 'vitest'

import ar from './ar.json'
import fr from './fr.json'
import it_ from './it.json'

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

/** Every path in the object, with array lengths, e.g. `home.pillars[4]`. */
function shape(value: Json, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return [`${prefix}[${value.length}]`, ...value.flatMap((item, index) => shape(item, `${prefix}[${index}]`))]
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => shape(child, prefix ? `${prefix}.${key}` : key))
  }
  return [prefix]
}

function emptyStrings(value: Json, prefix = ''): string[] {
  if (typeof value === 'string') return value.trim() ? [] : [prefix]
  if (Array.isArray(value)) return value.flatMap((item, index) => emptyStrings(item, `${prefix}[${index}]`))
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, child]) => emptyStrings(child, `${prefix}.${key}`))
  return []
}

describe('translations', () => {
  const reference = shape(it_ as Json).sort()

  it.each([
    ['ar', ar],
    ['fr', fr],
  ])('%s has exactly the same keys as it', (_locale, messages) => {
    expect(shape(messages as Json).sort()).toEqual(reference)
  })

  it.each([
    ['it', it_],
    ['ar', ar],
    ['fr', fr],
  ])('%s has no empty strings', (_locale, messages) => {
    expect(emptyStrings(messages as Json)).toEqual([])
  })
})
