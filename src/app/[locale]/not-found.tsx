import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { getDictionary, getLocale } from '@/i18n/dictionaries'
import { href } from '@/lib/site'

export default async function NotFound() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-display text-7xl font-bold text-green-200">404</p>
      <h1 className="mt-4 text-3xl font-bold text-ink-heading">{dict.notFound.title}</h1>
      <p className="mt-3 text-ink-muted">{dict.notFound.text}</p>
      <ButtonLink href={href(locale)} className="mt-8">
        {dict.notFound.home}
      </ButtonLink>
    </Container>
  )
}
