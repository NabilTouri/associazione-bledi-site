import { Mail, MapPin, Phone, Share2 } from 'lucide-react'
import type { Metadata } from 'next'

import { ContactForm } from '@/components/forms/ContactForm'
import { Container } from '@/components/ui/Container'
import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { href, mapsUrl, osmEmbedUrl, resolveSettings, routes } from '@/lib/site'
import { getSiteSettings } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.contact.title, description: dict.contact.intro }
}

export default async function ContactPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const settings = resolveSettings(await getSiteSettings(locale), dict)

  return (
    <>
      <PageHeader title={dict.contact.title} intro={dict.contact.intro} />
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <ContactForm locale={locale} labels={dict.contact} formLabels={dict.forms} privacyHref={href(locale, routes.privacy)} />

        <aside className="space-y-6">
          <ul className="space-y-5 rounded-3xl bg-white p-6 ring-1 ring-sand-200">
            <li className="flex gap-3">
              <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-600" />
              <div>
                <p className="text-sm font-semibold text-muted">{dict.contact.addressTitle}</p>
                <a href={mapsUrl(settings.mapQuery)} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                  {settings.address}
                </a>
              </div>
            </li>
            {settings.email && (
              <li className="flex gap-3">
                <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-600" />
                <div>
                  <p className="text-sm font-semibold text-muted">{dict.contact.emailTitle}</p>
                  <a href={`mailto:${settings.email}`} className="font-medium hover:underline">
                    {settings.email}
                  </a>
                </div>
              </li>
            )}
            {settings.phone && (
              <li className="flex gap-3">
                <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-600" />
                <div>
                  <p className="text-sm font-semibold text-muted">{dict.contact.phoneTitle}</p>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="font-medium hover:underline" dir="ltr">
                    {settings.phone}
                  </a>
                </div>
              </li>
            )}
            {settings.social.length > 0 && (
              <li className="flex gap-3">
                <Share2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-600" />
                <div>
                  <p className="text-sm font-semibold text-muted">{dict.contact.followUs}</p>
                  <p className="flex flex-wrap gap-x-4">
                    {settings.social.map((item) => (
                      <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                        {item.platform}
                      </a>
                    ))}
                  </p>
                </div>
              </li>
            )}
          </ul>
          {settings.isPlaceholder && (
            <Notice variant="info" compact>
              {dict.common.placeholderNotice}
            </Notice>
          )}
          <iframe
            title={dict.home.whereTitle}
            src={osmEmbedUrl(settings.location)}
            loading="lazy"
            className="h-72 w-full rounded-3xl border-0 ring-1 ring-sand-200"
          />
        </aside>
      </Container>
    </>
  )
}
