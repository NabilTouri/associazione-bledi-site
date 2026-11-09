import Link from 'next/link'
import type { ComponentProps } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'light'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand hover:bg-brand-strong shadow-sm',
  accent: 'bg-accent text-on-accent hover:bg-accent-strong shadow-sm',
  secondary: 'bg-surface-raised text-brand-soft-ink ring-1 ring-border-control hover:ring-brand hover:text-ink-link',
  ghost: 'text-ink-link hover:bg-brand-soft',
  light: 'bg-white/10 text-on-brand ring-1 ring-white/30 hover:bg-white/20',
}

export const buttonClasses = (variant: ButtonVariant = 'primary', className = '') =>
  `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`

export function ButtonLink({ variant = 'primary', className = '', ...props }: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClasses(variant, className)} {...props} />
}
