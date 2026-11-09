import { CheckCircle2, Circle, FileText } from 'lucide-react'
import type { Metadata } from 'next'

import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { resolveSettings } from '@/lib/site'
import { getSiteSettings, getTransparencyDocuments } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.transparency.title, description: dict.transparency.intro }
}

export default async function TransparencyPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const [settingsData, documents] = await Promise.all([getSiteSettings(locale), getTransparencyDocuments(locale)])
  const settings = resolveSettings(settingsData, dict)
  const registered = settings.runtsStatus === 'registered'

  return (
    <>
      <PageHeader title={dict.transparency.title} intro={dict.transparency.intro} />
      <Section>
        {registered ? (
          <dl className="mb-10 grid gap-4 sm:grid-cols-2">
            {settings.runtsNumber && (
              <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200">
                <dt className="text-sm text-muted">RUNTS</dt>
                <dd className="mt-1 font-mono text-lg font-semibold">{settings.runtsNumber}</dd>
              </div>
            )}
            {settings.fiscalCode && (
              <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200">
                <dt className="text-sm text-muted">{dict.donate.fiveTitle}</dt>
                <dd className="mt-1 font-mono text-lg font-semibold">{settings.fiscalCode}</dd>
              </div>
            )}
          </dl>
        ) : (
          <Notice variant="soon" title={dict.transparency.runtsTitle} className="mb-10">
            {dict.transparency.runtsText}
          </Notice>
        )}

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-primary-900">{dict.transparency.documentsTitle}</h2>
            {documents.length ? (
              <ul className="mt-6 divide-y divide-sand-200 rounded-3xl bg-white ring-1 ring-sand-200">
                {documents.map((doc) => (
                  <li key={doc._id} className="flex items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-3">
                      <FileText aria-hidden className="size-6 shrink-0 text-primary-600" />
                      <div>
                        <p className="font-semibold">{doc.title}</p>
                        <p className="text-sm text-muted">
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
                        className="shrink-0 font-semibold text-primary-700 hover:text-primary-900"
                      >
                        {dict.transparency.download}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-3xl bg-white p-8 text-muted ring-1 ring-sand-200">{dict.transparency.documentsEmpty}</p>
            )}
          </div>
          <div className="rounded-3xl bg-sand-100 p-6 ring-1 ring-sand-200">
            <h2 className="text-xl font-bold text-primary-900">{dict.transparency.plannedTitle}</h2>
            <ul className="mt-4 space-y-3">
              {dict.transparency.planned.map((item, index) => {
                const done = index === 4 ? registered : false
                const Icon = done ? CheckCircle2 : Circle
                return (
                  <li key={item} className="flex gap-3">
                    <Icon aria-hidden className={`mt-0.5 size-5 shrink-0 ${done ? 'text-primary-600' : 'text-sand-300'}`} />
                    <span>{item}</span>
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
