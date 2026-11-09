'use client'

import { CheckCircle2 } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

import type { Dictionary } from '@/i18n/dictionaries'
import type { FormErrorKey } from '@/lib/validation'

export type FormLabels = Dictionary['forms']

export function FieldError({ id, error, labels }: { id: string; error?: keyof FormLabels; labels: FormLabels }) {
  if (!error) return null
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-accent-ink">
      {labels[error] ?? labels.error}
    </p>
  )
}

type InputProps = Omit<ComponentProps<'input'>, 'name'> & {
  name: string
  label: string
  error?: keyof FormLabels
  labels: FormLabels
  multiline?: false
}
type TextareaProps = Omit<ComponentProps<'textarea'>, 'name'> & {
  name: string
  label: string
  error?: keyof FormLabels
  labels: FormLabels
  multiline: true
}

export function Field(props: InputProps | TextareaProps) {
  const { name, label, error, labels, required, className = '' } = props
  const id = `field-${name}`
  const errorId = `${id}-error`
  const shared = {
    id,
    name,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: 'field-input',
  }
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && (
          <span aria-hidden className="text-accent-ink">
            {' '}
            *
          </span>
        )}
      </label>
      {props.multiline ? <textarea rows={5} {...omit(props)} {...shared} /> : <input type="text" {...omit(props)} {...shared} />}
      <FieldError id={errorId} error={error} labels={labels} />
    </div>
  )
}

function omit<T extends { label: string; labels: FormLabels; error?: keyof FormLabels; multiline?: boolean; className?: string }>(
  props: T,
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { label, labels, error, multiline, className, ...rest } = props
  return rest
}

/** Hidden from humans; bots that fill it in are ignored by the server. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}

export function ConsentCheckbox({
  label,
  error,
  labels,
  privacyHref,
}: {
  label: string
  error?: FormErrorKey
  labels: FormLabels
  privacyHref: string
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'consent-error' : undefined}
          className="check-input mt-0.5"
        />
        <span>
          <a href={privacyHref} className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
            {label}
          </a>
          <span aria-hidden className="text-accent-ink">
            {' '}
            *
          </span>
        </span>
      </label>
      <FieldError id="consent-error" error={error} labels={labels} />
    </div>
  )
}

export function SuccessMessage({ title, demoNote }: { title: string; demoNote?: string | null }) {
  return (
    <div role="status" className="rounded-3xl bg-brand-soft p-8 text-center ring-1 ring-success-line">
      <CheckCircle2 aria-hidden className="mx-auto size-12 text-brand" />
      <p className="mt-4 text-lg font-semibold text-ink-heading">{title}</p>
      {demoNote && <p className="mt-3 text-sm text-ink-muted">{demoNote}</p>}
    </div>
  )
}

export function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative rounded-3xl bg-surface-raised p-6 shadow-sm ring-1 ring-border sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-ink-heading">{title}</h2>
      {children}
    </div>
  )
}
