import 'server-only'

import { mockProvider } from './mock-provider'
import type { PaymentProvider } from './types'

/**
 * Selects the payment provider from `PAYMENT_PROVIDER`.
 * Only the demo provider exists today; see BACKLOG.md ("Pagamenti reali").
 */
export function getPaymentProvider(): PaymentProvider {
  switch (process.env.PAYMENT_PROVIDER) {
    // case 'stripe': return stripeProvider
    default:
      return mockProvider
  }
}

export type { DonationRequest, PaymentProvider, StartDonationResult } from './types'
