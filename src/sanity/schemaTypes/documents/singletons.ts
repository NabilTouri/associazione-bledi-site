import { House, Settings, Users } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { imageField } from '../objects/imageWithAlt'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Impostazioni del sito',
  type: 'document',
  icon: Settings,
  groups: [
    { name: 'general', title: 'Generale', default: true },
    { name: 'contacts', title: 'Contatti e sede' },
    { name: 'legal', title: 'Dati legali e donazioni' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Nome dell’associazione', type: 'localeString', group: 'general' }),
    defineField({ name: 'tagline', title: 'Slogan', type: 'localeString', group: 'general' }),
    defineField({
      name: 'description',
      title: 'Descrizione (SEO)',
      type: 'localeText',
      group: 'general',
      description: 'Usata dai motori di ricerca e nelle anteprime dei social.',
    }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contacts', validation: (rule) => rule.email() }),
    defineField({ name: 'phone', title: 'Telefono', type: 'string', group: 'contacts' }),
    defineField({
      name: 'address',
      title: 'Indirizzo',
      type: 'string',
      group: 'contacts',
      description: 'Es. Via Roma 1, 25121 Brescia (BS)',
    }),
    defineField({
      name: 'mapQuery',
      title: 'Ricerca per le mappe',
      type: 'string',
      group: 'contacts',
      description: 'Testo usato per il link "Apri in mappe". Se vuoto viene usato l’indirizzo.',
    }),
    defineField({
      name: 'location',
      title: 'Posizione sulla mappa',
      type: 'object',
      group: 'contacts',
      description: 'Coordinate della sede (puoi copiarle da Google Maps).',
      fields: [
        defineField({ name: 'lat', title: 'Latitudine', type: 'number', validation: (rule) => rule.min(-90).max(90) }),
        defineField({ name: 'lng', title: 'Longitudine', type: 'number', validation: (rule) => rule.min(-180).max(180) }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social network',
      type: 'array',
      group: 'contacts',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Piattaforma',
              type: 'string',
              options: { list: ['Facebook', 'Instagram', 'WhatsApp', 'TikTok', 'YouTube', 'Telegram'] },
            }),
            defineField({ name: 'url', title: 'Link', type: 'url' }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'runtsStatus',
      title: 'Stato iscrizione RUNTS',
      type: 'string',
      group: 'legal',
      initialValue: 'not_registered',
      options: {
        list: [
          { title: 'Non iscritta', value: 'not_registered' },
          { title: 'Iscrizione in corso', value: 'in_progress' },
          { title: 'Iscritta', value: 'registered' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'runtsNumber', title: 'Numero di iscrizione RUNTS', type: 'string', group: 'legal' }),
    defineField({ name: 'fiscalCode', title: 'Codice fiscale (per il 5×1000)', type: 'string', group: 'legal' }),
    defineField({ name: 'iban', title: 'IBAN per i bonifici', type: 'string', group: 'legal' }),
    defineField({
      name: 'donationsEnabled',
      title: 'Pagamenti online attivi',
      type: 'boolean',
      group: 'legal',
      initialValue: false,
      description: 'Lasciare disattivato finché il fornitore di pagamento (es. Stripe) non è configurato: il sito mostra la versione demo.',
    }),
    defineField({ name: 'membershipFee', title: 'Quota associativa annuale (€)', type: 'number', group: 'legal' }),
  ],
  preview: { prepare: () => ({ title: 'Impostazioni del sito' }) },
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: House,
  fieldsets: [{ name: 'join', title: 'Riquadro "Fai parte della comunità"', options: { collapsible: true, collapsed: false } }],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Etichetta sopra il titolo',
      type: 'localeString',
      description: 'Es. "Associazione culturale · Brescia"',
    }),
    defineField({ name: 'heroTitle', title: 'Titolo principale', type: 'localeString' }),
    defineField({ name: 'heroSubtitle', title: 'Sottotitolo', type: 'localeText' }),
    imageField('heroImage', 'Immagine di copertina'),
    defineField({ name: 'aboutTitle', title: 'Titolo "Cos’è Bledi"', type: 'localeString' }),
    defineField({ name: 'aboutText', title: 'Testo "Cos’è Bledi"', type: 'localeText' }),
    defineField({
      name: 'pillars',
      title: 'Come operiamo (riquadri)',
      type: 'array',
      validation: (rule) => rule.max(6),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Titolo', type: 'localeString' }),
            defineField({ name: 'text', title: 'Testo', type: 'localeText' }),
          ],
          preview: { select: { title: 'title.it', subtitle: 'text.it' } },
        }),
      ],
    }),
    defineField({ name: 'joinTitle', title: 'Titolo', type: 'localeString', fieldset: 'join' }),
    defineField({ name: 'joinText', title: 'Testo', type: 'localeText', fieldset: 'join' }),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Pagina "Chi siamo"',
  type: 'document',
  icon: Users,
  fields: [
    defineField({ name: 'intro', title: 'Introduzione', type: 'localeText' }),
    defineField({ name: 'mission', title: 'Missione', type: 'localeText' }),
    defineField({ name: 'story', title: 'La nostra storia', type: 'localeBlockContent' }),
    defineField({
      name: 'values',
      title: 'Valori',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Titolo', type: 'localeString' }),
            defineField({ name: 'text', title: 'Testo', type: 'localeText' }),
          ],
          preview: { select: { title: 'title.it', subtitle: 'text.it' } },
        }),
      ],
    }),
    imageField('image', 'Immagine'),
  ],
  preview: { prepare: () => ({ title: 'Pagina "Chi siamo"' }) },
})
