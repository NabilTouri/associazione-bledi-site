import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/content/RichText'
import { SanityImage } from '@/components/content/SanityImage'
import { Container } from '@/components/ui/Container'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/i18n/config'
import { formatDate } from '@/lib/format'
import { href, routes } from '@/lib/site'
import { getPost, getPostSlugs, slugParams } from '@/sanity/lib/data'
import { urlForImage } from '@/sanity/lib/image'

export async function generateStaticParams() {
  return slugParams(await getPostSlugs())
}

async function load(params: PageProps<'/[locale]/notizie/[slug]'>['params']) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const post = await getPost(locale, slug)
  if (!post) notFound()
  return { locale, post }
}

export async function generateMetadata({ params }: PageProps<'/[locale]/notizie/[slug]'>): Promise<Metadata> {
  const { post } = await load(params)
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.cover?.asset ? [urlForImage(post.cover).width(1200).height(630).fit('crop').url()] : undefined,
    },
  }
}

export default async function PostPage({ params }: PageProps<'/[locale]/notizie/[slug]'>) {
  const { locale, post } = await load(params)
  const dict = getDictionary(locale)
  const isAnnouncement = post.kind === 'announcement'

  return (
    <article className="pb-20">
      <header className="border-b border-sand-200 bg-sand-100">
        <Container className="max-w-3xl py-12 sm:py-16">
          <Link
            href={href(locale, routes.news)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
            {dict.news.title}
          </Link>
          <p className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`rounded-full px-3 py-1 font-semibold ${isAnnouncement ? 'bg-accent-500/10 text-accent-600' : 'bg-primary-50 text-primary-700'}`}
            >
              {isAnnouncement ? dict.news.announcement : dict.news.news}
            </span>
            <time dateTime={post.publishedAt} className="text-muted">
              {dict.common.publishedOn} {formatDate(post.publishedAt, locale)}
            </time>
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-xl leading-relaxed text-muted">{post.excerpt}</p>}
        </Container>
      </header>
      <Container className="max-w-3xl pt-10">
        {post.cover?.asset && (
          <SanityImage
            image={post.cover}
            width={1400}
            height={790}
            priority
            sizes="(min-width: 768px) 720px, 100vw"
            className="mb-10 w-full rounded-3xl"
          />
        )}
        <div className="text-lg">
          <RichText value={post.body} />
        </div>
      </Container>
    </article>
  )
}
