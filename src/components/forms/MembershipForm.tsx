'use client'

import { useActionState, useState, type FormEvent } from 'react'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { membershipSchema, fieldErrors, type FormErrorKey } from '@/lib/validation'
import { submitMembership, type FormState } from '@/lib/actions'

import { buttonClasses } from '../ui/ButtonLink'
import { ConsentCheckbox, Field, FieldError, FormCard, Honeypot, SuccessMessage } from './fields'

export function MembershipForm({
  locale,
  labels,
  formLabels,
  privacyHref,
}: {
  locale: Locale
  labels: Dictionary['join']
  formLabels: Dictionary['forms']
  privacyHref: string
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitMembership, { status: 'idle' })
  const [clientErrors, setClientErrors] = useState<Record<string, FormErrorKey> | null>(null)
  const errors = clientErrors ?? state.errors ?? {}

  // Validate in the browser first so typed values are kept on error.
  function validate(event: FormEvent<HTMLFormElement>) {
    const result = membershipSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)))
    if (result.success) {
      setClientErrors(null)
    } else {
      event.preventDefault()
      setClientErrors(fieldErrors(result.error))
    }
  }

  if (state.status === 'success') {
    return (
      <FormCard title={labels.formTitle}>
        <SuccessMessage title={labels.success} demoNote={state.demo ? formLabels.demoNote : null} />
      </FormCard>
    )
  }

  const types = [
    { value: 'member', label: labels.typeMember },
    { value: 'volunteer', label: labels.typeVolunteer },
    { value: 'both', label: labels.typeBoth },
  ]

  return (
    <FormCard title={labels.formTitle}>
      <form action={action} onSubmit={validate} noValidate className="space-y-5" data-testid="membership-form">
        <input type="hidden" name="locale" value={locale} />
        <Honeypot />
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">
            {labels.type}
            <span aria-hidden className="text-accent-ink">
              {' '}
              *
            </span>
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {types.map((type, index) => (
              <label
                key={type.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-control bg-surface-raised px-4 py-3 text-sm font-medium transition-colors hover:border-brand has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-brand-soft-ink has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand"
              >
                <input type="radio" name="type" value={type.value} defaultChecked={index === 0} className="radio-input" />
                {type.label}
              </label>
            ))}
          </div>
          <FieldError id="type-error" error={errors.type} labels={formLabels} />
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="firstName"
            label={labels.firstName}
            required
            autoComplete="given-name"
            error={errors.firstName}
            labels={formLabels}
          />
          <Field name="lastName" label={labels.lastName} required autoComplete="family-name" error={errors.lastName} labels={formLabels} />
          <Field name="email" type="email" label={labels.email} required autoComplete="email" error={errors.email} labels={formLabels} />
          <Field name="phone" type="tel" label={labels.phone} autoComplete="tel" error={errors.phone} labels={formLabels} />
        </div>
        <Field name="city" label={labels.city} autoComplete="address-level2" error={errors.city} labels={formLabels} />
        <Field name="notes" multiline label={labels.notes} error={errors.notes} labels={formLabels} />
        <ConsentCheckbox label={formLabels.consent} error={errors.consent} labels={formLabels} privacyHref={privacyHref} />
        {state.status === 'error' && !state.errors && (
          <p role="alert" className="text-sm font-medium text-accent-ink">
            {formLabels.error}
          </p>
        )}
        <button type="submit" disabled={pending} className={buttonClasses('primary')}>
          {pending ? formLabels.sending : labels.submit}
        </button>
      </form>
    </FormCard>
  )
}
