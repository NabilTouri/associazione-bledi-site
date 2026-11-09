import { CheckCircle2, Circle, FileText } from 'lucide-react'
import type { Metadata } from 'next'

import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { resolveSettings } from '@/lib/site'
import { getSiteSettings, getTransparencyDocuments, getTransparencyPage } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.transparency.title, description: dict.transparency.intro }
}

export default async function TransparencyPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const [settingsData, documents, page] = await Promise.all([
    getSiteSettings(locale),
    getTransparencyDocuments(locale),
    getTransparencyPage(locale),
  ])
  const settings = resolveSettings(settingsData, dict)
  const registered = settings.runtsStatus === 'registered'
  // Texts edited in Sanity ("Pagina Trasparenza"), with the dictionary as fallback.
  const runtsTitle = page?.runtsTitle ?? dict.transparency.runtsTitle
  const runtsText = page?.runtsText ?? dict.transparency.runtsText
  const planned = page?.planned?.length ? page.planned : dict.transparency.planned.map((label) => ({ label, done: false }))

  return (
    <>
      <PageHeader title={dict.transparency.title} intro={dict.transparency.intro} />
      <Section>
        {registered ? (
          <dl className="mb-10 grid gap-4 sm:grid-cols-2">
            {settings.runtsNumber && (
              <div className="rounded-2xl bg-surface-raised p-5 ring-1 ring-border">
                <dt className="text-sm text-ink-muted">RUNTS</dt>
                <dd className="mt-1 font-mono text-lg font-semibold">{settings.runtsNumber}</dd>
              </div>
            )}
            {settings.fiscalCode && (
              <div className="rounded-2xl bg-surface-raised p-5 ring-1 ring-border">
                <dt className="text-sm text-ink-muted">{dict.donate.fiveTitle}</dt>
                <dd className="mt-1 font-mono text-lg font-semibold">{settings.fiscalCode}</dd>
              </div>
            )}
          </dl>
        ) : (
          <Notice variant="soon" title={runtsTitle} className="mb-10">
            {runtsText}
          </Notice>
        )}

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-ink-heading">{dict.transparency.documentsTitle}</h2>
            {documents.length ? (
              <ul className="mt-6 divide-y divide-border rounded-3xl bg-surface-raised ring-1 ring-border">
                {documents.map((doc) => (
                  <li key={doc._id} className="flex items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-3">
                      <FileText aria-hidden className="size-6 shrink-0 text-brand" />
                      <div>
                        <p className="font-semibold">{doc.title}</p>
                        <p className="text-sm text-ink-muted">
                          {dict.transparency.docTypes[doc.kind]}
                          {doc.year ? ` · ${doc.year}` : ''}
                        </p>
                      </div>
                    </div>
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 font-semibold text-ink-link hover:text-ink-heading"
                      >
                        {dict.transparency.download}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-3xl bg-surface-raised p-8 text-ink-muted ring-1 ring-border">{dict.transparency.documentsEmpty}</p>
            )}
          </div>
          <div className="rounded-3xl bg-surface-alt p-6 ring-1 ring-border">
            <h2 className="text-xl font-bold text-ink-heading">{dict.transparency.plannedTitle}</h2>
            <ul className="mt-4 space-y-3">
              {planned.map((item) => {
                const Icon = item.done ? CheckCircle2 : Circle
                return (
                  <li key={item.label} className="flex gap-3">
                    <Icon aria-hidden className={`mt-0.5 size-5 shrink-0 ${item.done ? 'text-brand' : 'text-border-control'}`} />
                    <span>{item.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}
