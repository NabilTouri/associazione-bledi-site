/**
 * Card checks for the demo checkout only. With a real provider the card form
 * is rendered by the provider (e.g. Stripe Elements / Checkout) and card data
 * never touches this code.
 */

export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length < 12 || digits.length > 19) return false
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

/** Accepts `MM/YY`; valid until the end of that month. */
export function isValidExpiry(value: string, now = new Date()): boolean {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim())
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return false
  const endOfMonth = new Date(year, month, 1)
  return endOfMonth.getTime() > now.getTime()
}

export function isValidCvc(value: string): boolean {
  return /^\d{3,4}$/.test(value.trim())
}

/** `4242424242424242` -> `4242 4242 4242 4242` */
export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

/** `1229` -> `12/29` */
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}
