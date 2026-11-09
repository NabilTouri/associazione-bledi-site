import { useId } from 'react'

/** Decorative eight-pointed star pattern, inspired by North African tilework. */
export function Pattern({ className = '' }: { className?: string }) {
  const id = useId()
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M26.98 7.24Q28 6 29.02 7.24L34.06 13.37L41.96 12.6Q43.56 12.44 43.4 14.04L42.63 21.94L48.76 26.98Q50 28 48.76 29.02L42.63 34.06L43.4 41.96Q43.56 43.56 41.96 43.4L34.06 42.63L29.02 48.76Q28 50 26.98 48.76L21.94 42.63L14.04 43.4Q12.44 43.56 12.6 41.96L13.37 34.06L7.24 29.02Q6 28 7.24 26.98L13.37 21.94L12.6 14.04Q12.44 12.44 14.04 12.6L21.94 13.37Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
