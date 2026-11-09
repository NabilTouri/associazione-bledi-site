import { useId } from 'react'

/** Decorative eight-pointed star pattern, inspired by North African tilework. */
export function Pattern({ className = '' }: { className?: string }) {
  const id = useId()
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M28 6l6.2 9.8L45.6 13l-2.8 11.4L52.6 28l-9.8 6.2 2.8 11.4-11.4-2.8L28 52.6l-6.2-9.8-11.4 2.8 2.8-11.4L3.4 28l9.8-6.2L10.4 10.4l11.4 2.8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="28" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
