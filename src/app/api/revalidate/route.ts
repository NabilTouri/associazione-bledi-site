import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

interface WebhookPayload {
  _type?: string
  slug?: string
}

/**
 * Called by a Sanity webhook on every publish/unpublish/delete.
 * Invalidates the cached queries for that document type (see `sanityFetch`).
 *
 * Webhook setup (sanity.io/manage → API → Webhooks):
 * - URL: https://<domain>/api/revalidate
 * - Trigger on: create, update, delete
 * - Projection: {_type, "slug": slug.current}
 * - Secret: same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return Response.json({ message: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 500 })
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(request, secret, true)
    if (!isValidSignature) {
      return Response.json({ message: 'Invalid signature' }, { status: 401 })
    }
    if (!body?._type) {
      return Response.json({ message: 'Missing _type' }, { status: 400 })
    }
    revalidateTag(body._type, 'max')
    return Response.json({ revalidated: true, type: body._type, slug: body.slug ?? null })
  } catch (error) {
    console.error('[revalidate] webhook failed', error)
    return Response.json({ message: 'Error while revalidating' }, { status: 500 })
  }
}
