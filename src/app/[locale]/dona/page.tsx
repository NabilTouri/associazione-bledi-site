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
import { getSiteSettings } from '@/sanity/lib/data'

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
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 ring-1 ring-sand-200">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">{icon}</span>
        {unavailableLabel && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            <Clock3 aria-hidden className="size-3.5" />
            {unavailableLabel}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-primary-900">{title}</h3>
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </div>
  )
}

export default async function DonatePage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const settings = resolveSettings(await getSiteSettings(locale), dict)
  const isDemo = getPaymentProvider().isDemo || !settings.donationsEnabled
  const registered = settings.runtsStatus === 'registered'

  return (
    <>
      <PageHeader title={dict.donate.title} intro={dict.donate.intro} />
      <Container className="py-14">
        {isDemo && (
          <Notice variant="demo" title={dict.donate.demoTitle} className="mb-10">
            {dict.donate.demoBanner}
          </Notice>
        )}
        <DonationFlow locale={locale} labels={dict.donate} formLabels={dict.forms} />
      </Container>

      <Section title={dict.donate.otherWaysTitle} className="bg-white">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <WayCard
            icon={<Landmark aria-hidden className="size-5" />}
            title={dict.donate.bankTitle}
            unavailableLabel={settings.iban ? undefined : dict.common.comingSoon}
          >
            {settings.iban ? (
              <p className="font-mono text-base font-semibold break-all text-ink" dir="ltr">
                {settings.iban}
              </p>
            ) : (
              dict.donate.bankText
            )}
          </WayCard>
          <WayCard
            icon={<Percent aria-hidden className="size-5" />}
            title={dict.donate.fiveTitle}
            unavailableLabel={registered ? undefined : dict.common.notAvailableYet}
          >
            {registered && settings.fiscalCode ? (
              <p className="font-mono text-base font-semibold text-ink">{settings.fiscalCode}</p>
            ) : (
              dict.donate.fiveText
            )}
          </WayCard>
          <WayCard
            icon={<Receipt aria-hidden className="size-5" />}
            title={dict.donate.taxTitle}
            unavailableLabel={registered ? undefined : dict.common.notAvailableYet}
          >
            {dict.donate.taxText}
          </WayCard>
          <WayCard icon={<HandHeart aria-hidden className="size-5" />} title={dict.donate.volunteerTitle}>
            <p>{dict.donate.volunteerText}</p>
            <ButtonLink href={href(locale, routes.join)} variant="ghost" className="-ms-3 mt-3">
              {dict.nav.join}
            </ButtonLink>
          </WayCard>
        </div>
      </Section>
    </>
  )
}
