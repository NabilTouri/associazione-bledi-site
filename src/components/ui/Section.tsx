import type { ReactNode } from 'react'

import { Container } from './Container'

export function Section({
  id,
  title,
  intro,
  action,
  children,
  className = '',
}: {
  id?: string
  title?: string
  intro?: string | null
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  const headingId = id ? `${id}-title` : undefined
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={`py-14 sm:py-20 ${className}`}>
      <Container>
        {(title || action) && (
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              {title && (
                <h2 id={headingId} className="text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">
                  {title}
                </h2>
              )}
              {intro && <p className="mt-3 max-w-2xl text-lg text-muted">{intro}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
