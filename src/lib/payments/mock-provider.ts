import type { PaymentProvider, StartDonationResult } from './types'

/** Demo provider: accepts every valid request, charges nothing, stores nothing. */
export const mockProvider: PaymentProvider = {
  id: 'mock',
  isDemo: true,
  async startDonation(request): Promise<StartDonationResult> {
    const prefix = request.frequency === 'monthly' ? 'DEMO-M' : 'DEMO'
    const reference = `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
    return { type: 'demo', reference }
  },
}
