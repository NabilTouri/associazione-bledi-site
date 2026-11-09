import { UserRound } from 'lucide-react'
import type { Metadata } from 'next'

import { RichText } from '@/components/content/RichText'
import { SanityImage } from '@/components/content/SanityImage'
import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { getAboutPage, getBoardMembers } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.about.title, description: dict.about.mission }
}

export default async function AboutPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const [about, board] = await Promise.all([getAboutPage(locale), getBoardMembers(locale)])
  const values = about?.values?.length ? about.values : dict.about.values

  return (
    <>
      <PageHeader title={dict.about.title} intro={about?.intro ?? dict.about.intro} />

      {!about && (
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <Notice variant="info" compact>
            {dict.common.placeholderNotice}
          </Notice>
        </div>
      )}

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-primary-900">{dict.about.missionTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/90">{about?.mission ?? dict.about.mission}</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary-900">{dict.about.storyTitle}</h2>
              <div className="mt-4 text-lg">
                {about?.story?.length ? (
                  <RichText value={about.story} />
                ) : (
                  <p className="leading-relaxed text-ink/90">{dict.about.story}</p>
                )}
              </div>
            </div>
          </div>
          {about?.image?.asset && (
            <SanityImage
              image={about.image}
              width={900}
              height={1000}
              sizes="(min-width: 1024px) 540px, 100vw"
              className="aspect-[9/10] w-full rounded-[2rem] object-cover"
            />
          )}
        </div>
      </Section>

      <Section title={dict.about.valuesTitle} className="bg-white">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <li key={value.title} className="rounded-3xl border-t-4 border-primary-600 bg-sand-50 p-6 ring-1 ring-sand-200">
              <h3 className="text-xl font-bold text-primary-900">{value.title}</h3>
              <p className="mt-2 text-muted">{value.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={dict.about.boardTitle}>
        {board.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {board.map((member) => (
              <li key={member._id} className="rounded-3xl bg-white p-6 text-center ring-1 ring-sand-200">
                {member.photo?.asset ? (
                  <SanityImage
                    image={member.photo}
                    alt={member.name}
                    width={240}
                    height={240}
                    sizes="120px"
                    className="mx-auto size-28 rounded-full object-cover"
                  />
                ) : (
                  <span className="mx-auto flex size-28 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <UserRound aria-hidden className="size-12" />
                  </span>
                )}
                <p className="mt-4 text-lg font-bold text-primary-900">{member.name}</p>
                {member.role && <p className="text-muted">{member.role}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl bg-white p-8 text-center text-muted ring-1 ring-sand-200">{dict.about.boardEmpty}</p>
        )}
      </Section>
    </>
  )
}
