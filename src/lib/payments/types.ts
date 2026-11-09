import type { Locale } from '@/i18n/config'
import type { DonationInput } from '@/lib/validation'

export type DonationFrequency = DonationInput['frequency']

export interface DonationRequest extends DonationInput {
  locale: Locale
}

/**
 * What the browser should do next.
 * - `redirect`: go to the provider's hosted checkout (e.g. Stripe Checkout).
 * - `demo`: show the simulated card form; nothing is charged.
 */
export type StartDonationResult = { type: 'redirect'; url: string; reference: string } | { type: 'demo'; reference: string }

/**
 * A payment provider. Add a new one (Stripe, PayPal, …) by implementing this
 * interface and selecting it in `./index.ts`. Recurring donations map to the
 * provider's subscriptions.
 */
export interface PaymentProvider {
  readonly id: string
  readonly isDemo: boolean
  startDonation(request: DonationRequest): Promise<StartDonationResult>
}
