'use client'

import { ArrowLeft, ArrowRight, Check, CreditCard, Heart, Lock, Repeat } from 'lucide-react'
import { useState, useTransition, type FormEvent } from 'react'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { startDonation } from '@/lib/actions'
import { formatCurrency } from '@/lib/format'
import { formatCardNumber, formatExpiry, isValidCvc, isValidExpiry, luhnCheck } from '@/lib/payments/card'
import type { ImpactAmount } from '@/sanity/lib/types'
import { donationSchema, fieldErrors, MAX_DONATION, MIN_DONATION, type DonationInput } from '@/lib/validation'

import { Field, FieldError } from '../forms/fields'
import { buttonClasses } from '../ui/ButtonLink'

type Labels = Dictionary['donate']
type FormLabels = Dictionary['forms']
type Step = 'amount' | 'details' | 'payment' | 'done'
type CardErrorKey = 'required' | 'invalidCard' | 'invalidExpiry' | 'invalidCvc'

const steps: Step[] = ['amount', 'details', 'payment', 'done']
const presets = [10, 25, 50, 100] as const
const DEMO_PROCESSING_MS = 1200

export function DonationFlow({
  locale,
  labels,
  formLabels,
  impact,
}: {
  locale: Locale
  labels: Labels
  formLabels: FormLabels
  /** "What your donation does" sentence per preset amount (from Sanity or the dictionary). */
  impact: Record<ImpactAmount, string>
}) {
  const [step, setStep] = useState<Step>('amount')
  const [frequency, setFrequency] = useState<DonationInput['frequency']>('monthly')
  const [preset, setPreset] = useState<number | null>(25)
  const [custom, setCustom] = useState('')
  const [donor, setDonor] = useState({ firstName: '', lastName: '', email: '', message: '', anonymous: false, receipt: true })
  const [card, setCard] = useState({ holder: '', number: '', expiry: '', cvc: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [reference, setReference] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [processing, setProcessing] = useState(false)

  const amount = preset ?? Number(custom.replace(',', '.'))
  const amountValid = Number.isFinite(amount) && amount >= MIN_DONATION && amount <= MAX_DONATION
  const stepIndex = steps.indexOf(step)

  function goTo(next: Step) {
    setErrors({})
    setStep(next)
    document.getElementById('donation-flow')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function submitAmount(event: FormEvent) {
    event.preventDefault()
    if (!amountValid) return setErrors({ amount: 'invalidAmount' })
    goTo('details')
  }

  function submitDetails(event: FormEvent) {
    event.preventDefault()
    const input = { amount, frequency, ...donor }
    const parsed = donationSchema.safeParse(input)
    if (!parsed.success) return setErrors(fieldErrors(parsed.error))
    startTransition(async () => {
      const response = await startDonation(input, locale)
      if (!response.ok) return setErrors(response.errors)
      if (response.result.type === 'redirect') {
        window.location.assign(response.result.url)
        return
      }
      setReference(response.result.reference)
      goTo('payment')
    })
  }

  function submitPayment(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, CardErrorKey> = {}
    if (!card.holder.trim()) next.holder = 'required'
    if (!luhnCheck(card.number)) next.number = 'invalidCard'
    if (!isValidExpiry(card.expiry)) next.expiry = 'invalidExpiry'
    if (!isValidCvc(card.cvc)) next.cvc = 'invalidCvc'
    if (Object.keys(next).length) return setErrors(next)
    setProcessing(true)
    // Demo only: pretend the provider is confirming the payment.
    setTimeout(() => {
      setProcessing(false)
      setCard({ holder: '', number: '', expiry: '', cvc: '' })
      goTo('done')
    }, DEMO_PROCESSING_MS)
  }

  function restart() {
    setReference(null)
    setDonor({ firstName: '', lastName: '', email: '', message: '', anonymous: false, receipt: true })
    goTo('amount')
  }

  const amountLabel = amountValid ? formatCurrency(amount, locale) : '—'
  const err = (key: string) => errors[key] as keyof FormLabels | undefined

  return (
    <div id="donation-flow" className="scroll-mt-28" data-testid="donation-flow">
      {/* Stepper */}
      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label={labels.title}>
        {steps.map((s, index) => {
          const done = index < stepIndex
          const current = index === stepIndex
          return (
            <li key={s} aria-current={current ? 'step' : undefined} className="flex flex-col gap-2">
              <span className={`h-1.5 rounded-full ${done || current ? 'bg-brand' : 'bg-surface-sunken'}`} />
              <span
                className={`flex items-center gap-1.5 text-xs font-semibold sm:text-sm ${current ? 'text-brand-soft-ink' : 'text-ink-muted'}`}
              >
                {done && <Check aria-hidden className="size-4 text-brand" />}
                {labels.steps[s]}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
        <div className="min-w-0 rounded-3xl bg-surface-raised p-4 shadow-sm ring-1 ring-border sm:p-8">
          {step === 'amount' && (
            <form onSubmit={submitAmount} noValidate className="space-y-8">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">{labels.frequency}</legend>
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-surface-alt p-1.5">
                  {(['one_time', 'monthly'] as const).map((value) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-sm font-semibold whitespace-nowrap text-ink-muted has-[:checked]:bg-surface-raised has-[:checked]:text-brand-soft-ink has-[:checked]:shadow-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand sm:gap-2 sm:px-4"
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={value}
                        checked={frequency === value}
                        onChange={() => setFrequency(value)}
                        className="sr-only"
                      />
                      {value === 'monthly' ? <Repeat aria-hidden className="size-4" /> : <Heart aria-hidden className="size-4" />}
                      {value === 'monthly' ? labels.monthly : labels.oneTime}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-semibold">{labels.amount}</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {presets.map((value) => (
                    <label
                      key={value}
                      className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-border bg-surface-raised px-3 py-4 text-center transition-colors hover:border-border-control has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2"
                    >
                      <input
                        type="radio"
                        name="amount"
                        value={value}
                        checked={preset === value}
                        onChange={() => {
                          setPreset(value)
                          setErrors({})
                        }}
                        className="sr-only"
                      />
                      <span className="text-2xl font-bold text-ink-heading" dir="ltr">
                        {formatCurrency(value, locale)}
                      </span>
                      {frequency === 'monthly' && <span className="text-xs text-ink-muted">{labels.perMonth}</span>}
                    </label>
                  ))}
                </div>
                <label
                  className={`mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border-2 px-4 py-3 transition-colors focus-within:border-brand ${
                    preset === null ? 'border-brand bg-brand-soft' : 'border-border bg-surface-raised hover:border-border-control'
                  } ${err('amount') ? 'border-accent-ink!' : ''}`}
                >
                  <span className="text-sm font-semibold text-ink-muted">{labels.customAmount}</span>
                  <span className="ms-auto flex items-baseline gap-1.5">
                    <span className="flex items-baseline gap-1.5" dir="ltr">
                      <span aria-hidden className="text-xl font-bold text-ink-heading">
                        €
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="customAmount"
                        value={custom}
                        placeholder="35"
                        maxLength={8}
                        onFocus={() => setPreset(null)}
                        onChange={(event) => {
                          setPreset(null)
                          setErrors({})
                          setCustom(event.target.value.replace(/[^\d.,]/g, ''))
                        }}
                        aria-label={labels.customAmount}
                        aria-invalid={err('amount') ? true : undefined}
                        aria-describedby={err('amount') ? 'amount-error' : undefined}
                        className="w-24 border-0 border-b-2 border-dashed border-border-control bg-transparent p-0 text-end text-2xl font-bold text-ink-heading placeholder:text-border-control focus:border-brand focus:outline-none"
                      />
                    </span>
                    {frequency === 'monthly' && <span className="text-xs text-ink-muted">{labels.perMonth}</span>}
                  </span>
                </label>
                <FieldError id="amount-error" error={err('amount')} labels={formLabels} />
                {preset && (
                  <p className="mt-4 rounded-2xl bg-brand-soft p-4 text-sm text-ink-heading">{impact[String(preset) as ImpactAmount]}</p>
                )}
              </fieldset>

              <button type="submit" className={buttonClasses('primary', 'w-full sm:w-auto')}>
                {labels.continue}
                <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
              </button>
            </form>
          )}

          {step === 'details' && (
            <form onSubmit={submitDetails} noValidate className="space-y-5">
              <h2 className="text-2xl font-bold text-ink-heading">{labels.detailsTitle}</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  name="firstName"
                  label={labels.firstName}
                  required
                  autoComplete="given-name"
                  value={donor.firstName}
                  onChange={(event) => setDonor({ ...donor, firstName: event.target.value })}
                  error={err('firstName')}
                  labels={formLabels}
                />
                <Field
                  name="lastName"
                  label={labels.lastName}
                  required
                  autoComplete="family-name"
                  value={donor.lastName}
                  onChange={(event) => setDonor({ ...donor, lastName: event.target.value })}
                  error={err('lastName')}
                  labels={formLabels}
                />
              </div>
              <Field
                name="email"
                type="email"
                label={labels.email}
                required
                autoComplete="email"
                value={donor.email}
                onChange={(event) => setDonor({ ...donor, email: event.target.value })}
                error={err('email')}
                labels={formLabels}
              />
              <Field
                name="message"
                multiline
                rows={3}
                label={labels.message}
                value={donor.message}
                onChange={(event) => setDonor({ ...donor, message: event.target.value })}
                labels={formLabels}
              />
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={donor.anonymous}
                  onChange={(event) => setDonor({ ...donor, anonymous: event.target.checked })}
                  className="check-input"
                />
                {labels.anonymous}
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={donor.receipt}
                  onChange={(event) => setDonor({ ...donor, receipt: event.target.checked })}
                  className="check-input"
                />
                {labels.receipt}
              </label>
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="button" onClick={() => goTo('amount')} className={buttonClasses('secondary')}>
                  <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
                  {labels.back}
                </button>
                <button type="submit" disabled={pending} className={buttonClasses('primary')}>
                  {pending ? labels.processing : labels.continue}
                  <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={submitPayment} noValidate className="space-y-5">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-ink-heading">
                <CreditCard aria-hidden className="size-6 text-brand" />
                {labels.paymentTitle}
              </h2>
              <p className="rounded-xl border-[1.5px] border-dashed border-border-control bg-surface-alt p-3 text-sm text-ink">
                {labels.demoCardHint}
              </p>
              <Field
                name="cc-name"
                autoComplete="off"
                label={labels.cardHolder}
                value={card.holder}
                onChange={(event) => setCard({ ...card, holder: event.target.value })}
                error={err('holder')}
                labels={formLabels}
              />
              <Field
                name="cc-number"
                inputMode="numeric"
                autoComplete="off"
                dir="ltr"
                placeholder="4242 4242 4242 4242"
                label={labels.cardNumber}
                value={card.number}
                onChange={(event) => setCard({ ...card, number: formatCardNumber(event.target.value) })}
                error={err('number')}
                labels={formLabels}
              />
              <div className="grid grid-cols-2 gap-5">
                <Field
                  name="cc-exp"
                  inputMode="numeric"
                  autoComplete="off"
                  dir="ltr"
                  placeholder="12/29"
                  label={labels.expiry}
                  value={card.expiry}
                  onChange={(event) => setCard({ ...card, expiry: formatExpiry(event.target.value) })}
                  error={err('expiry')}
                  labels={formLabels}
                />
                <Field
                  name="cc-csc"
                  inputMode="numeric"
                  autoComplete="off"
                  dir="ltr"
                  placeholder="123"
                  maxLength={4}
                  label={labels.cvc}
                  value={card.cvc}
                  onChange={(event) => setCard({ ...card, cvc: event.target.value.replace(/\D/g, '') })}
                  error={err('cvc')}
                  labels={formLabels}
                />
              </div>
              <p className="flex items-start gap-2 text-xs text-ink-muted">
                <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                {labels.secure}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="button" onClick={() => goTo('details')} disabled={processing} className={buttonClasses('secondary')}>
                  <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
                  {labels.back}
                </button>
                <button type="submit" disabled={processing} className={buttonClasses('accent')}>
                  <Heart aria-hidden className="size-4" />
                  {processing ? labels.processing : `${labels.pay} ${amountLabel}`}
                </button>
              </div>
            </form>
          )}

          {step === 'done' && (
            <div role="status" className="py-6 text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand-soft-ink">
                <Check aria-hidden className="size-8" />
              </span>
              <h2 className="mt-6 text-3xl font-bold text-ink-heading">{labels.successTitle}</h2>
              <p className="mx-auto mt-3 max-w-md text-ink-muted">{labels.successText}</p>
              {frequency === 'monthly' && <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{labels.successMonthly}</p>}
              {reference && (
                <p className="mt-6 text-sm">
                  {labels.reference}:{' '}
                  <code className="rounded bg-surface-alt px-2 py-1 font-mono font-semibold" data-testid="donation-reference">
                    {reference}
                  </code>
                </p>
              )}
              <button type="button" onClick={restart} className={buttonClasses('secondary', 'mt-8')}>
                {labels.startOver}
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="on-brand h-fit rounded-3xl bg-surface-brand p-6 text-on-brand lg:sticky lg:top-28">
          <p className="text-sm font-semibold text-on-brand-muted uppercase">{labels.summary}</p>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between gap-4">
              <dt className="text-on-brand-muted">{labels.frequency}</dt>
              <dd className="font-semibold">{frequency === 'monthly' ? labels.monthly : labels.oneTime}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/15 pt-3 text-lg">
              <dt>{labels.total}</dt>
              <dd className="font-bold" data-testid="donation-total">
                {amountLabel}
                {frequency === 'monthly' && amountValid && (
                  <span className="text-sm font-normal text-on-brand-muted">{labels.perMonth}</span>
                )}
              </dd>
            </div>
          </dl>
          <p className="mt-6 flex items-start gap-2 text-xs text-on-brand-muted">
            <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {labels.secure}
          </p>
        </aside>
      </div>
    </div>
  )
}
