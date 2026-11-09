import type { Metadata } from 'next'

import { PostCard } from '@/components/content/PostCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { getPosts } from '@/sanity/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale())
  return { title: dict.news.title, description: dict.news.intro }
}

export default async function NewsPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const posts = await getPosts(locale)

  return (
    <>
      <PageHeader title={dict.news.title} intro={dict.news.intro} />
      <Section>
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} locale={locale} labels={dict.news} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-white p-10 text-center text-muted ring-1 ring-sand-200">{dict.news.empty}</p>
        )}
      </Section>
    </>
  )
}
