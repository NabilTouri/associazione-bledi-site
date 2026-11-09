'use server'

import { isLocale } from '@/i18n/config'
import { getPaymentProvider, type StartDonationResult } from '@/lib/payments'
import { contactSchema, donationSchema, fieldErrors, membershipSchema, type FormErrorKey } from '@/lib/validation'
import { writeClient } from '@/sanity/lib/write-client'

export interface FormState {
  status: 'idle' | 'success' | 'error'
  errors?: Record<string, FormErrorKey>
  /** True when the submission was accepted but not stored (Sanity not connected). */
  demo?: boolean
}

/** Hidden field that real users never fill in. Bots usually do. */
const HONEYPOT = 'website'

function readForm(formData: FormData) {
  return Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, typeof value === 'string' ? value : '']))
}

async function storeSubmission(doc: Record<string, unknown>): Promise<{ demo: boolean }> {
  if (!writeClient) {
    console.info('[forms] Sanity write token missing, submission not stored (demo mode).')
    return { demo: true }
  }
  await writeClient.create({ _type: 'submission', status: 'new', ...doc })
  return { demo: false }
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = readForm(formData)
  if (raw[HONEYPOT]) return { status: 'success' }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) return { status: 'error', errors: fieldErrors(parsed.error) }

  const { name, email, subject, message } = parsed.data
  try {
    const { demo } = await storeSubmission({
      kind: 'contact',
      name,
      email,
      subject,
      message,
      locale: isLocale(raw.locale) ? raw.locale : 'it',
    })
    return { status: 'success', demo }
  } catch (error) {
    console.error('[forms] contact submission failed', error)
    return { status: 'error' }
  }
}

export async function submitMembership(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = readForm(formData)
  if (raw[HONEYPOT]) return { status: 'success' }

  const parsed = membershipSchema.safeParse(raw)
  if (!parsed.success) return { status: 'error', errors: fieldErrors(parsed.error) }

  const { type, firstName, lastName, email, phone, city, notes } = parsed.data
  const typeLabel = { member: 'Socio', volunteer: 'Volontario', both: 'Socio e volontario' }[type]
  try {
    const { demo } = await storeSubmission({
      kind: 'membership',
      name: `${firstName} ${lastName}`,
      email,
      phone,
      subject: `Adesione: ${typeLabel}`,
      message: notes,
      details: [`Tipo: ${typeLabel}`, city ? `Comune: ${city}` : null].filter(Boolean).join('\n'),
      locale: isLocale(raw.locale) ? raw.locale : 'it',
    })
    return { status: 'success', demo }
  } catch (error) {
    console.error('[forms] membership submission failed', error)
    return { status: 'error' }
  }
}

export type DonationActionResult =
  { ok: true; result: StartDonationResult; demo: boolean } | { ok: false; errors: Record<string, FormErrorKey> }

/** Validates the donation and asks the payment provider how to continue. */
export async function startDonation(input: unknown, locale: string): Promise<DonationActionResult> {
  const parsed = donationSchema.safeParse(input)
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) }

  const provider = getPaymentProvider()
  const result = await provider.startDonation({ ...parsed.data, locale: isLocale(locale) ? locale : 'it' })
  return { ok: true, result, demo: provider.isDemo }
}
