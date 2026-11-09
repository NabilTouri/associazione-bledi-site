import { defineField } from 'sanity'

/** Image field with hotspot and alt text, reused across documents. */
export function imageField(name: string, title: string, options: { required?: boolean; description?: string } = {}) {
  return defineField({
    name,
    title,
    type: 'image',
    description: options.description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Testo alternativo',
        type: 'string',
        description: 'Breve descrizione dell’immagine (accessibilità e SEO).',
      }),
    ],
    validation: options.required ? (rule) => rule.required() : undefined,
  })
}
