import { HandHeart, IdCard } from 'lucide-react'
import type { Metadata } from 'next'

import { MembershipForm } from '@/components/forms/MembershipForm'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { formatCurrency } from '@/lib/format'
import { href, resolveSettings, routes } from '@/lib/site'
import { getSiteSettings } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.join.title, description: dict.join.intro }
}

export default async function JoinPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const settings = resolveSettings(await getSiteSettings(locale), dict)

  const roles = [
    { icon: IdCard, title: dict.join.memberTitle, text: dict.join.memberText },
    { icon: HandHeart, title: dict.join.volunteerTitle, text: dict.join.volunteerText },
  ]

  return (
    <>
      <PageHeader title={dict.join.title} intro={dict.join.intro} />
      <Container className="grid gap-10 py-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          {roles.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white p-6 ring-1 ring-sand-200">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
                <Icon aria-hidden className="size-6" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-primary-900">{title}</h2>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </div>
          ))}
          <p className="rounded-2xl bg-sand-100 p-4 text-sm text-muted">
            {settings.membershipFee ? `${dict.join.feeLabel}: ${formatCurrency(settings.membershipFee, locale)}` : dict.join.feeNote}
          </p>
        </div>
        <MembershipForm locale={locale} labels={dict.join} formLabels={dict.forms} privacyHref={href(locale, routes.privacy)} />
      </Container>
    </>
  )
}
