import { Construction, Info, Sparkles, TriangleExclamationPoint } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'info' | 'soon' | 'demo' | 'warning'

const styles: Record<Variant, { box: string; icon: ReactNode }> = {
  info: { box: 'bg-info-soft text-info-ink ring-1 ring-info-line', icon: <Info aria-hidden className="size-5 shrink-0" /> },
  soon: {
    box: 'bg-warning-soft text-warning-ink ring-1 ring-warning-line',
    icon: <Construction aria-hidden className="size-5 shrink-0" />,
  },
  demo: {
    box: 'border-[1.5px] border-dashed border-border-control bg-surface-alt text-ink',
    icon: <Sparkles aria-hidden className="size-5 shrink-0 text-ink-link" />,
  },
  warning: {
    box: 'bg-danger-soft text-danger-ink ring-1 ring-danger-line',
    icon: <TriangleExclamationPoint aria-hidden className="size-5 shrink-0" />,
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
      className={`flex gap-3 rounded-2xl ${compact ? 'p-3 text-sm' : 'p-4 sm:p-5'} ${style.box} ${className}`}
    >
      {style.icon}
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  )
}
