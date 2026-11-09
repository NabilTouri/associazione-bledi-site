import Link from 'next/link'
import type { ComponentProps } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'light'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm',
  secondary: 'bg-white text-primary-800 ring-1 ring-sand-300 hover:ring-primary-500 hover:text-primary-700',
  ghost: 'text-primary-700 hover:bg-primary-50',
  light: 'bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20',
}

export const buttonClasses = (variant: ButtonVariant = 'primary', className = '') =>
  `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`

export function ButtonLink({ variant = 'primary', className = '', ...props }: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClasses(variant, className)} {...props} />
}
