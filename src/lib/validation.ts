import { z } from 'zod'

/**
 * Shared by client components and server actions. Error messages are keys of
 * `dictionary.forms`, translated at render time.
 */
export type FormErrorKey = 'required' | 'invalidEmail' | 'tooShort' | 'invalidAmount' | 'consentRequired'

const requiredText = (max = 200) => z.string().trim().min(1, 'required').max(max, 'tooShort')
const email = z.string().trim().min(1, 'required').email('invalidEmail').max(200)
const optionalText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined)
const consent = z.literal('on', { message: 'consentRequired' })

export const contactSchema = z.object({
  name: requiredText(),
  email,
  subject: optionalText(200),
  message: z.string().trim().min(10, 'tooShort').max(5000),
  consent,
})
export type ContactInput = z.infer<typeof contactSchema>

export const membershipSchema = z.object({
  type: z.enum(['member', 'volunteer', 'both'], { message: 'required' }),
  firstName: requiredText(),
  lastName: requiredText(),
  email,
  phone: optionalText(40),
  city: optionalText(100),
  notes: optionalText(),
  consent,
})
export type MembershipInput = z.infer<typeof membershipSchema>

export const MIN_DONATION = 1
export const MAX_DONATION = 10_000

export const donationSchema = z.object({
  amount: z.number({ message: 'invalidAmount' }).min(MIN_DONATION, 'invalidAmount').max(MAX_DONATION, 'invalidAmount'),
  frequency: z.enum(['one_time', 'monthly']),
  firstName: requiredText(),
  lastName: requiredText(),
  email,
  anonymous: z.boolean(),
  receipt: z.boolean(),
  message: optionalText(500),
})
export type DonationInput = z.infer<typeof donationSchema>

/** Flattens zod issues into `{ field: errorKey }` (first error per field). */
export function fieldErrors(error: z.ZodError): Record<string, FormErrorKey> {
  const result: Record<string, FormErrorKey> = {}
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'form')
    result[field] ??= issue.message as FormErrorKey
  }
  return result
}
