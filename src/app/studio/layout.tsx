/** Separate root layout: the Studio does not use the website's header, footer or styles. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
