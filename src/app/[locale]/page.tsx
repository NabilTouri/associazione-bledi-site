import { ArrowRight, CalendarDays, Compass, HandHeart, Heart, MapPin, Palette, Users } from 'lucide-react'
import Link from 'next/link'

import { EventCard } from '@/components/content/EventCard'
import { PostCard } from '@/components/content/PostCard'
import { SanityImage } from '@/components/content/SanityImage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { LogoSymbol } from '@/components/ui/Logo'
import { Notice } from '@/components/ui/Notice'
import { Pattern } from '@/components/ui/Pattern'
import { Section } from '@/components/ui/Section'
import { PrayerTimes } from '@/components/widgets/PrayerTimes'
import { localeTags } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { href, mapsUrl, osmEmbedUrl, resolveSettings, routes } from '@/lib/site'
import { getHomePage, getPosts, getSiteSettings, getUpcomingEvents } from '@/sanity/lib/data'

const pillarIcons = [Users, Palette, HandHeart, Compass]

export default async function HomePage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const [home, settingsData, events, posts] = await Promise.all([
    getHomePage(locale),
    getSiteSettings(locale),
    getUpcomingEvents(locale, 3),
    getPosts(locale, 3),
  ])
  const settings = resolveSettings(settingsData, dict)
  const pillars = home?.pillars?.length ? home.pillars : dict.home.pillars

  return (
    <>
      {/* Hero */}
      <section className="on-brand relative overflow-hidden bg-surface-brand text-on-brand">
        <Pattern className="text-on-brand/[0.07]" />
        <Container className="relative grid items-center gap-12 py-14 sm:py-28 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/20">
              <span aria-hidden className="size-2 rounded-full bg-accent" />
              {home?.eyebrow ?? dict.home.eyebrow}
            </p>
            <h1 className="mt-6 text-[2.25rem] leading-[1.15] font-bold tracking-tight sm:text-6xl">
              {home?.heroTitle ?? dict.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-brand-muted">{home?.heroSubtitle ?? dict.home.heroSubtitle}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={href(locale, routes.events)} variant="secondary">
                <CalendarDays aria-hidden className="size-4" />
                {dict.home.ctaEvents}
              </ButtonLink>
              <ButtonLink href={href(locale, routes.join)} variant="light">
                {dict.home.ctaJoin}
              </ButtonLink>
              <ButtonLink href={href(locale, routes.donate)} variant="accent">
                <Heart aria-hidden className="size-4" />
                {dict.home.ctaDonate}
              </ButtonLink>
            </div>
          </div>
          <div className="relative hidden lg:block">
            {home?.heroImage?.asset ? (
              <SanityImage
                image={home.heroImage}
                width={900}
                height={1000}
                priority
                sizes="(min-width: 1024px) 480px, 0px"
                className="aspect-[9/10] w-full rounded-[2.5rem] object-cover shadow-2xl ring-1 ring-white/20"
              />
            ) : (
              <div className="relative flex aspect-[9/10] items-center justify-center overflow-hidden rounded-[2.5rem] bg-surface-deep ring-1 ring-white/15">
                <Pattern className="text-on-brand/[0.08]" />
                <div className="relative text-center">
                  <LogoSymbol tone="reversed" className="mx-auto h-36 w-auto" />
                  <p className="mt-8 font-display text-4xl font-bold" lang="ar" dir="rtl">
                    بلادي
                  </p>
                  <p className="mt-2 text-on-brand-muted">Brescia · Algérie</p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {!home && (
        <Container className="pt-8">
          <Notice variant="info" compact>
            {dict.common.placeholderNotice}
          </Notice>
        </Container>
      )}

      {/* What is Bledi */}
      <Section id="about">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2 id="about-title" className="text-3xl font-bold tracking-tight text-ink-heading sm:text-4xl">
            {home?.aboutTitle ?? dict.home.aboutTitle}
          </h2>
          <div>
            <p className="text-xl leading-relaxed text-ink/90">{home?.aboutText ?? dict.home.aboutText}</p>
            <Link
              href={href(locale, routes.about)}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-ink-link hover:text-ink-heading"
            >
              {dict.common.learnMore}
              <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </Section>

      {/* How we operate */}
      <Section id="how" title={dict.home.howTitle} className="bg-surface-raised">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = pillarIcons[index % pillarIcons.length]
            return (
              <li key={pillar.title} className="rounded-3xl bg-surface p-6 ring-1 ring-border">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-on-brand">
                  <Icon aria-hidden className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink-heading">{pillar.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{pillar.text}</p>
              </li>
            )
          })}
        </ul>
      </Section>

      {/* Upcoming events */}
      <Section
        id="events"
        title={dict.home.upcomingEvents}
        action={
          <ButtonLink href={href(locale, routes.events)} variant="ghost" className="-ms-4 sm:ms-0">
            {dict.common.allEvents}
            <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
          </ButtonLink>
        }
      >
        {events.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} locale={locale} freeLabel={dict.common.free} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-surface-raised p-8 text-center text-ink-muted ring-1 ring-border">{dict.home.noEvents}</p>
        )}
      </Section>

      {/* News */}
      <Section
        id="news"
        title={dict.home.latestNews}
        className="bg-surface-raised"
        action={
          <ButtonLink href={href(locale, routes.news)} variant="ghost" className="-ms-4 sm:ms-0">
            {dict.common.allNews}
            <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
          </ButtonLink>
        }
      >
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} locale={locale} labels={dict.news} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-surface p-8 text-center text-ink-muted ring-1 ring-border">{dict.home.noNews}</p>
        )}
      </Section>

      {/* Prayer times */}
      <Section id="prayer">
        <PrayerTimes labels={dict.prayer} localeTag={localeTags[locale]} />
      </Section>

      {/* Where we are */}
      <Section id="where" title={dict.home.whereTitle} className="bg-surface-raised">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-5">
            <p className="text-lg text-ink-muted">{dict.home.whereText}</p>
            <p className="flex items-start gap-3 text-lg font-semibold text-ink-heading">
              <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-accent-ink" />
              {settings.address}
            </p>
            {settings.isPlaceholder && (
              <Notice variant="info" compact>
                {dict.common.placeholderNotice}
              </Notice>
            )}
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={mapsUrl(settings.mapQuery)} target="_blank" rel="noopener noreferrer" variant="primary">
                {dict.home.openMap}
              </ButtonLink>
              <ButtonLink href={href(locale, routes.contact)} variant="secondary">
                {dict.nav.contact}
              </ButtonLink>
            </div>
          </div>
          <iframe
            title={dict.home.whereTitle}
            src={osmEmbedUrl(settings.location)}
            loading="lazy"
            className="h-80 w-full rounded-3xl border-0 ring-1 ring-border lg:h-96"
          />
        </div>
      </Section>

      {/* Join */}
      <section className="on-brand relative overflow-hidden bg-surface-brand text-on-brand">
        <Pattern className="text-on-brand/[0.08]" />
        <Container className="relative flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">{home?.joinTitle ?? dict.home.joinTitle}</h2>
            <p className="mt-3 text-lg text-on-brand-muted">{home?.joinText ?? dict.home.joinText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={href(locale, routes.join)} variant="secondary">
              {dict.home.ctaJoin}
            </ButtonLink>
            <ButtonLink href={href(locale, routes.donate)} variant="accent">
              <Heart aria-hidden className="size-4" />
              {dict.home.ctaDonate}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
