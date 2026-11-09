'use client'

import { Send } from 'lucide-react'
import { useActionState, useState, type FormEvent } from 'react'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { contactSchema, fieldErrors, type FormErrorKey } from '@/lib/validation'
import { submitContact, type FormState } from '@/lib/actions'

import { buttonClasses } from '../ui/ButtonLink'
import { ConsentCheckbox, Field, FormCard, Honeypot, SuccessMessage } from './fields'

export function ContactForm({
  locale,
  labels,
  formLabels,
  privacyHref,
}: {
  locale: Locale
  labels: Dictionary['contact']
  formLabels: Dictionary['forms']
  privacyHref: string
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, { status: 'idle' })
  const [clientErrors, setClientErrors] = useState<Record<string, FormErrorKey> | null>(null)
  const errors = clientErrors ?? state.errors ?? {}

  // Validate in the browser first so typed values are kept on error.
  function validate(event: FormEvent<HTMLFormElement>) {
    const result = contactSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)))
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

  return (
    <FormCard title={labels.formTitle}>
      <form action={action} onSubmit={validate} noValidate className="space-y-5" data-testid="contact-form">
        <input type="hidden" name="locale" value={locale} />
        <Honeypot />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="name" label={labels.name} required autoComplete="name" error={errors.name} labels={formLabels} />
          <Field name="email" type="email" label={labels.email} required autoComplete="email" error={errors.email} labels={formLabels} />
        </div>
        <Field name="subject" label={labels.subject} error={errors.subject} labels={formLabels} />
        <Field name="message" multiline label={labels.message} required error={errors.message} labels={formLabels} />
        <ConsentCheckbox label={formLabels.consent} error={errors.consent} labels={formLabels} privacyHref={privacyHref} />
        {state.status === 'error' && !state.errors && (
          <p role="alert" className="text-sm font-medium text-accent-600">
            {formLabels.error}
          </p>
        )}
        <button type="submit" disabled={pending} className={buttonClasses('primary')}>
          <Send aria-hidden className="size-4 rtl:-scale-x-100" />
          {pending ? formLabels.sending : labels.submit}
        </button>
      </form>
    </FormCard>
  )
}
