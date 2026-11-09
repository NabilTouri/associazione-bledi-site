import type { ReactNode } from 'react'

import { Pattern } from './Pattern'
import { Container } from './Container'

export function PageHeader({ title, intro, children }: { title: string; intro?: string | null; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden border-b border-border bg-surface-alt">
      <Pattern className="text-ink-link/[0.06]" />
      <Container className="relative py-14 sm:py-20">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-ink-heading sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">{intro}</p>}
        {children}
      </Container>
    </header>
  )
}
