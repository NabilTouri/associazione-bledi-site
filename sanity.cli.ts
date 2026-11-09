/**
 * Configuration for the `sanity` CLI (e.g. `pnpm sanity dataset export`, `pnpm sanity cors add`).
 */
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineCliConfig({ api: { projectId, dataset } })
