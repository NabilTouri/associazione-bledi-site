import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Field-level translations: every translatable field is an object with one
 * sub-field per language. Italian is required, Arabic and French are optional
 * and fall back to Italian on the website.
 */
export const languages = [
  { id: 'it', title: 'Italiano', isDefault: true },
  { id: 'ar', title: 'العربية (arabo)' },
  { id: 'fr', title: 'Français (francese)' },
] as const

function localizedObject(name: string, title: string, fieldType: 'string' | 'text' | 'blockContent') {
  return defineType({
    name,
    title,
    type: 'object',
    fieldsets: [{ name: 'translations', title: 'Traduzioni', options: { collapsible: true, collapsed: false } }],
    fields: languages.map((lang) => {
      const isDefault = 'isDefault' in lang
      const common = { name: lang.id, title: lang.title, fieldset: isDefault ? undefined : 'translations' }
      const required = 'Il testo in italiano è obbligatorio'
      if (fieldType === 'text') {
        return defineField({ ...common, type: 'text', rows: 4, validation: (rule) => (isDefault ? rule.required().error(required) : rule) })
      }
      if (fieldType === 'string') {
        return defineField({ ...common, type: 'string', validation: (rule) => (isDefault ? rule.required().error(required) : rule) })
      }
      return defineField({ ...common, type: 'blockContent', validation: (rule) => (isDefault ? rule.required().error(required) : rule) })
    }),
  })
}

export const localeString = localizedObject('localeString', 'Testo breve tradotto', 'string')
export const localeText = localizedObject('localeText', 'Testo tradotto', 'text')
export const localeBlockContent = localizedObject('localeBlockContent', 'Contenuto tradotto', 'blockContent')

/** Rich text used inside `localeBlockContent`. */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Contenuto',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normale', value: 'normal' },
        { title: 'Titolo 2', value: 'h2' },
        { title: 'Titolo 3', value: 'h3' },
        { title: 'Citazione', value: 'blockquote' },
      ],
      lists: [
        { title: 'Puntato', value: 'bullet' },
        { title: 'Numerato', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Grassetto', value: 'strong' },
          { title: 'Corsivo', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) => rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Testo alternativo', type: 'string', description: 'Descrizione dell’immagine per chi usa screen reader.' },
      ],
    }),
  ],
})
