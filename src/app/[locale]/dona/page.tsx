import { Clock3, HandHeart, Landmark, Percent, Receipt } from 'lucide-react'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { DonationFlow } from '@/components/donate/DonationFlow'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { getPaymentProvider } from '@/lib/payments'
import { href, resolveSettings, routes } from '@/lib/site'
import { getDonatePage, getSiteSettings } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.donate.title, description: dict.donate.intro }
}

function WayCard({
  icon,
  title,
  children,
  unavailableLabel,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
  unavailableLabel?: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-surface-raised p-6 ring-1 ring-border">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-ink-link">{icon}</span>
        {unavailableLabel && (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning-ink">
            <Clock3 aria-hidden className="size-3.5" />
            {unavailableLabel}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-ink-heading">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-muted">{children}</div>
    </div>
  )
}

export default async function DonatePage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const [settingsData, page] = await Promise.all([getSiteSettings(locale), getDonatePage(locale)])
  const settings = resolveSettings(settingsData, dict)
  const text = dict.donate
  // Texts edited in Sanity ("Pagina Donazioni"), with the dictionary as fallback.
  const content = {
    demoTitle: page?.demoTitle ?? text.demoTitle,
    demoText: page?.demoText ?? text.demoBanner,
    impact: {
      '10': page?.impact?.['10'] ?? text.impact['10'],
      '25': page?.impact?.['25'] ?? text.impact['25'],
      '50': page?.impact?.['50'] ?? text.impact['50'],
      '100': page?.impact?.['100'] ?? text.impact['100'],
    },
    bank: { title: page?.bank?.title ?? text.bankTitle, text: page?.bank?.text ?? null, fallback: text.bankText },
    five: { title: page?.fiveXMille?.title ?? text.fiveTitle, text: page?.fiveXMille?.text ?? null, fallback: text.fiveText },
    tax: { title: page?.tax?.title ?? text.taxTitle, text: page?.tax?.text ?? text.taxText },
    volunteer: { title: page?.volunteer?.title ?? text.volunteerTitle, text: page?.volunteer?.text ?? text.volunteerText },
  }
  const isDemo = getPaymentProvider().isDemo || !settings.donationsEnabled
  const registered = settings.runtsStatus === 'registered'

  return (
    <>
      <PageHeader title={dict.donate.title} intro={dict.donate.intro} />
      <Container className="py-14">
        {isDemo && (
          <Notice variant="demo" title={content.demoTitle} className="mb-10">
            {content.demoText}
          </Notice>
        )}
        <DonationFlow locale={locale} labels={dict.donate} formLabels={dict.forms} impact={content.impact} />
      </Container>

      <Section title={dict.donate.otherWaysTitle} className="bg-surface-raised">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <WayCard
            icon={<Landmark aria-hidden className="size-5" />}
            title={content.bank.title}
            unavailableLabel={settings.iban ? undefined : dict.common.comingSoon}
          >
            {settings.iban ? (
              <>
                {content.bank.text && <p>{content.bank.text}</p>}
                <p className="font-mono text-base font-semibold break-all text-ink" dir="ltr">
                  {settings.iban}
                </p>
              </>
            ) : (
              (content.bank.text ?? content.bank.fallback)
            )}
          </WayCard>
          <WayCard
            icon={<Percent aria-hidden className="size-5" />}
            title={content.five.title}
            unavailableLabel={registered ? undefined : dict.common.notAvailableYet}
          >
            {registered && settings.fiscalCode ? (
              <>
                {content.five.text && <p>{content.five.text}</p>}
                <p className="font-mono text-base font-semibold text-ink">{settings.fiscalCode}</p>
              </>
            ) : (
              (content.five.text ?? content.five.fallback)
            )}
          </WayCard>
          <WayCard
            icon={<Receipt aria-hidden className="size-5" />}
            title={content.tax.title}
            unavailableLabel={registered ? undefined : dict.common.notAvailableYet}
          >
            {content.tax.text}
          </WayCard>
          <WayCard icon={<HandHeart aria-hidden className="size-5" />} title={content.volunteer.title}>
            <p>{content.volunteer.text}</p>
            <ButtonLink href={href(locale, routes.join)} variant="ghost" className="-ms-3 mt-3">
              {dict.nav.join}
            </ButtonLink>
          </WayCard>
        </div>
      </Section>
    </>
  )
}
