'use client'

/**
 * Sanity Studio configuration, served by Next.js at `/studio`.
 * Editors log in with their Sanity account; access is managed at sanity.io/manage.
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes, singletonTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'bledi',
  title: 'Associazione Bledi',
  basePath: '/studio',
  projectId: projectId || 'missing-project-id',
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons cannot be created from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Singletons cannot be duplicated or deleted.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType) ? input.filter(({ action }) => action && singletonActions.has(action)) : input,
  },
  plugins: [
    structureTool({ structure }),
    // GROQ playground for developers.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
