import { Construction, Info, Sparkles, TriangleExclamationPoint } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'info' | 'soon' | 'demo' | 'warning'

const styles: Record<Variant, { box: string; icon: ReactNode }> = {
  info: { box: 'bg-sky-50 text-sky-950 ring-sky-200', icon: <Info aria-hidden className="size-5 shrink-0 text-sky-700" /> },
  soon: {
    box: 'bg-amber-50 text-amber-950 ring-amber-200',
    icon: <Construction aria-hidden className="size-5 shrink-0 text-amber-700" />,
  },
  demo: {
    box: 'bg-violet-50 text-violet-950 ring-violet-200',
    icon: <Sparkles aria-hidden className="size-5 shrink-0 text-violet-700" />,
  },
  warning: {
    box: 'bg-red-50 text-red-950 ring-red-200',
    icon: <TriangleExclamationPoint aria-hidden className="size-5 shrink-0 text-red-700" />,
  },
}

/**
 * Transparent notice for features that are not live yet, demo mode or
 * placeholder content.
 */
export function Notice({
  variant = 'info',
  title,
  children,
  className = '',
  compact = false,
}: {
  variant?: Variant
  title?: string
  children: ReactNode
  className?: string
  compact?: boolean
}) {
  const style = styles[variant]
  return (
    <div
      role="note"
      data-notice={variant}
      className={`flex gap-3 rounded-2xl ring-1 ${compact ? 'p-3 text-sm' : 'p-4 sm:p-5'} ${style.box} ${className}`}
    >
      {style.icon}
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  )
}
