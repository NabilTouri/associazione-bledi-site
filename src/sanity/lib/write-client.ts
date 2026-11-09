import 'server-only'

import { createClient, type SanityClient } from 'next-sanity'

import { apiVersion, dataset, isSanityConfigured, projectId } from '../env'

const token = process.env.SANITY_API_WRITE_TOKEN

/**
 * Server-only client with write access, used to store form submissions.
 * `null` when the token is missing: forms then run in demo mode.
 */
export const writeClient: SanityClient | null =
  isSanityConfigured && token ? createClient({ projectId, dataset, apiVersion, token, useCdn: false }) : null
