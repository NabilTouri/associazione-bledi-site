import type { Metadata } from 'next'

import { RichText } from '@/components/content/RichText'
import { Container } from '@/components/ui/Container'
import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { getLegalPage } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.privacy.title }
}

export default async function PrivacyPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const page = await getLegalPage(locale, 'privacy')

  return (
    <>
      <PageHeader title={page?.title ?? dict.privacy.title} />
      <Container className="max-w-3xl py-14">
        {page?.body?.length ? (
          <RichText value={page.body} />
        ) : (
          <div className="space-y-6">
            <Notice variant="soon" compact>
              {dict.common.placeholderNotice}
            </Notice>
            <div className="prose-content text-lg">
              {dict.privacy.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  )
}
