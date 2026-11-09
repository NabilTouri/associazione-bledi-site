import { describe, expect, it } from 'vitest'

import { contactSchema, donationSchema, fieldErrors, membershipSchema } from './validation'

describe('contactSchema', () => {
  const valid = { name: 'Amina', email: 'amina@example.com', message: 'Vorrei informazioni sugli eventi.', consent: 'on' }

  it('accepts a complete message', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('reports translatable error keys per field', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'nope', message: 'ciao', consent: undefined })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(fieldErrors(result.error)).toEqual({ email: 'invalidEmail', message: 'tooShort', consent: 'consentRequired' })
    }
  })
})

describe('membershipSchema', () => {
  it('requires a membership type', () => {
    const result = membershipSchema.safeParse({ firstName: 'A', lastName: 'B', email: 'a@b.it', consent: 'on' })
    expect(result.success).toBe(false)
    if (!result.success) expect(fieldErrors(result.error).type).toBe('required')
  })

  it('turns empty optional fields into undefined', () => {
    const result = membershipSchema.parse({ type: 'both', firstName: 'A', lastName: 'B', email: 'a@b.it', phone: '', consent: 'on' })
    expect(result.phone).toBeUndefined()
  })
})

describe('donationSchema', () => {
  const valid = {
    amount: 25,
    frequency: 'monthly',
    firstName: 'Karim',
    lastName: 'B',
    email: 'karim@example.com',
    anonymous: false,
    receipt: true,
  }

  it('accepts a valid donation', () => {
    expect(donationSchema.safeParse(valid).success).toBe(true)
  })

  it.each([0, -5, 10_001, Number.NaN])('rejects amount %s', (amount) => {
    const result = donationSchema.safeParse({ ...valid, amount })
    expect(result.success).toBe(false)
    if (!result.success) expect(fieldErrors(result.error).amount).toBe('invalidAmount')
  })
})
