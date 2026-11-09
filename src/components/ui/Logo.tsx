/** Provisional logo mark: replace with the association's official logo (see BACKLOG.md). */
export function LogoMark({ className = 'size-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <rect width="48" height="48" rx="14" className="fill-primary-600" />
      <circle cx="21" cy="24" r="11" className="fill-white" />
      <circle cx="24.6" cy="24" r="9" className="fill-primary-600" />
      <path d="M31.5 19.4l1.3 2.7 3 .43-2.17 2.1.51 2.97-2.64-1.4-2.65 1.4.51-2.97-2.17-2.1 3-.43z" className="fill-accent-500" />
    </svg>
  )
}
