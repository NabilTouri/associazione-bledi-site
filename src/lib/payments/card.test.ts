import { describe, expect, it } from 'vitest'

import { formatCardNumber, formatExpiry, isValidCvc, isValidExpiry, luhnCheck } from './card'

describe('luhnCheck', () => {
  it('accepts well-known test cards', () => {
    expect(luhnCheck('4242 4242 4242 4242')).toBe(true)
    expect(luhnCheck('5555555555554444')).toBe(true)
  })
  it('rejects wrong numbers', () => {
    expect(luhnCheck('4242 4242 4242 4241')).toBe(false)
    expect(luhnCheck('1234')).toBe(false)
    expect(luhnCheck('')).toBe(false)
  })
})

describe('isValidExpiry', () => {
  const now = new Date(2026, 10, 9) // 9 Nov 2026
  it('accepts the current and future months', () => {
    expect(isValidExpiry('11/26', now)).toBe(true)
    expect(isValidExpiry('01/30', now)).toBe(true)
  })
  it('rejects past months and bad input', () => {
    expect(isValidExpiry('10/26', now)).toBe(false)
    expect(isValidExpiry('13/27', now)).toBe(false)
    expect(isValidExpiry('1227', now)).toBe(false)
  })
})

describe('formatting helpers', () => {
  it('groups card digits', () => expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242'))
  it('formats expiry', () => expect(formatExpiry('1229')).toBe('12/29'))
  it('validates cvc', () => {
    expect(isValidCvc('123')).toBe(true)
    expect(isValidCvc('12a')).toBe(false)
  })
})
