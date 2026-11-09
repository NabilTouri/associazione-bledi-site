import { Megaphone, Newspaper, Pin } from 'lucide-react'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { formatDate } from '@/lib/format'
import { href } from '@/lib/site'
import type { PostSummary } from '@/sanity/lib/types'

import { SanityImage } from './SanityImage'

export function PostCard({ post, locale, labels }: { post: PostSummary; locale: Locale; labels: Dictionary['news'] }) {
  const isAnnouncement = post.kind === 'announcement'
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-surface-raised shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${
        isAnnouncement ? 'ring-danger-line' : 'ring-border'
      }`}
    >
      {post.cover?.asset && (
        <div className="aspect-[16/9] bg-surface-alt">
          <SanityImage
            image={post.cover}
            width={800}
            height={450}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
              isAnnouncement ? 'bg-accent/10 text-accent-ink' : 'bg-brand-soft text-ink-link'
            }`}
          >
            {isAnnouncement ? <Megaphone aria-hidden className="size-3.5" /> : <Newspaper aria-hidden className="size-3.5" />}
            {isAnnouncement ? labels.announcement : labels.news}
          </span>
          {post.pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-warning-ink">
              <Pin aria-hidden className="size-3.5" />
              {labels.pinned}
            </span>
          )}
          <time dateTime={post.publishedAt} className="text-ink-muted">
            {formatDate(post.publishedAt, locale)}
          </time>
        </div>
        <h3 className="text-xl font-bold text-ink-heading">
          <Link href={href(locale, `/notizie/${post.slug}`)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="line-clamp-3 text-ink-muted">{post.excerpt}</p>}
      </div>
    </article>
  )
}
