<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- Read `README.md` (architecture), `CONTRIBUTING.md` (rules) and `BACKLOG.md` (open work) first.
- Every UI string lives in `src/messages/{it,ar,fr}.json`; keep the three files in sync (a unit test enforces it).
- Content comes from Sanity through `src/sanity/lib/data.ts`; every page must still render when Sanity returns `null`.
- Cache Components is on: no `Date.now()`/`new Date()` in server components outside `'use cache'`; dynamic routes need a non-empty `generateStaticParams` (see `slugParams`).
- Use logical CSS utilities (`ms-`, `me-`, `start-`, `end-`) so Arabic RTL works.
- Before pushing: `pnpm check`, and for UI changes `pnpm build && pnpm test:e2e`.
