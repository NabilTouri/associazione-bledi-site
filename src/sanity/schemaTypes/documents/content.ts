import { BookOpen, CalendarDays, FileDown, Images, Lightbulb, Newspaper, UserRound } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { imageField } from '../objects/imageWithAlt'

const slugField = defineField({
  name: 'slug',
  title: 'Indirizzo della pagina (slug)',
  type: 'slug',
  description: 'Generato dal titolo italiano. Evita di cambiarlo dopo la pubblicazione: i link condivisi smetterebbero di funzionare.',
  options: { source: 'title.it', maxLength: 96 },
  validation: (rule) => rule.required(),
})

export const post = defineType({
  name: 'post',
  title: 'Notizie e annunci',
  type: 'document',
  icon: Newspaper,
  fields: [
    defineField({ name: 'title', title: 'Titolo', type: 'localeString', validation: (rule) => rule.required() }),
    slugField,
    defineField({
      name: 'kind',
      title: 'Tipo',
      type: 'string',
      initialValue: 'news',
      options: {
        list: [
          { title: 'Notizia', value: 'news' },
          { title: 'Annuncio / comunicazione', value: 'announcement' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pinned',
      title: 'In evidenza',
      type: 'boolean',
      initialValue: false,
      description: 'Mostra in cima alla lista.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data di pubblicazione',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'excerpt', title: 'Riassunto', type: 'localeText', description: 'Una o due frasi mostrate nelle anteprime.' }),
    imageField('cover', 'Immagine di copertina'),
    defineField({ name: 'body', title: 'Testo', type: 'localeBlockContent' }),
  ],
  orderings: [{ title: 'Più recenti', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title.it', kind: 'kind', date: 'publishedAt', media: 'cover' },
    prepare: ({ title, kind, date, media }) => ({
      title,
      subtitle: `${kind === 'announcement' ? 'Annuncio' : 'Notizia'} · ${date ? new Date(date).toLocaleDateString('it-IT') : 'senza data'}`,
      media,
    }),
  },
})

export const event = defineType({
  name: 'event',
  title: 'Eventi',
  type: 'document',
  icon: CalendarDays,
  fields: [
    defineField({ name: 'title', title: 'Titolo', type: 'localeString', validation: (rule) => rule.required() }),
    slugField,
    defineField({ name: 'start', title: 'Inizio', type: 'datetime', validation: (rule) => rule.required() }),
    defineField({
      name: 'end',
      title: 'Fine',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((end, context) => {
          const start = (context.document as { start?: string } | undefined)?.start
          if (!end || !start) return true
          return new Date(end) >= new Date(start) || 'La fine deve essere successiva all’inizio'
        }),
    }),
    defineField({ name: 'locationName', title: 'Luogo', type: 'string', description: 'Es. Sala civica di quartiere' }),
    defineField({ name: 'address', title: 'Indirizzo', type: 'string' }),
    defineField({ name: 'isFree', title: 'Ingresso gratuito', type: 'boolean', initialValue: true }),
    defineField({ name: 'registrationUrl', title: 'Link per l’iscrizione', type: 'url', description: 'Facoltativo (es. modulo Google).' }),
    defineField({ name: 'excerpt', title: 'Riassunto', type: 'localeText' }),
    imageField('cover', 'Locandina / immagine'),
    defineField({ name: 'body', title: 'Descrizione', type: 'localeBlockContent' }),
  ],
  orderings: [{ title: 'Data evento', name: 'startDesc', by: [{ field: 'start', direction: 'desc' }] }],
  preview: {
    select: { title: 'title.it', start: 'start', media: 'cover', place: 'locationName' },
    prepare: ({ title, start, media, place }) => ({
      title,
      subtitle: [start ? new Date(start).toLocaleString('it-IT', { dateStyle: 'medium', timeStyle: 'short' }) : null, place]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})

export const activity = defineType({
  name: 'activity',
  title: 'Attività e servizi',
  type: 'document',
  icon: Lightbulb,
  fields: [
    defineField({ name: 'title', title: 'Nome', type: 'localeString', validation: (rule) => rule.required() }),
    defineField({ name: 'category', title: 'Categoria', type: 'localeString', description: 'Es. Corsi, Servizi, Giovani' }),
    defineField({
      name: 'status',
      title: 'Stato',
      type: 'string',
      initialValue: 'planned',
      description: 'Finché l’attività non è "Attiva" il sito la mostra con l’avviso "non ancora attiva".',
      options: {
        list: [
          { title: 'In progettazione', value: 'planned' },
          { title: 'Attiva', value: 'active' },
          { title: 'Sospesa', value: 'paused' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'schedule', title: 'Orari / frequenza', type: 'localeString', description: 'Es. Ogni sabato 10:00–12:00' }),
    defineField({ name: 'description', title: 'Descrizione', type: 'localeText' }),
    imageField('image', 'Immagine'),
    defineField({ name: 'order', title: 'Ordine', type: 'number', description: 'Numero più basso = mostrato prima.' }),
  ],
  preview: { select: { title: 'title.it', subtitle: 'status', media: 'image' } },
})

export const boardMember = defineType({
  name: 'boardMember',
  title: 'Direttivo',
  type: 'document',
  icon: UserRound,
  fields: [
    defineField({ name: 'name', title: 'Nome e cognome', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'role', title: 'Ruolo', type: 'localeString', description: 'Es. Presidente, Tesoriere' }),
    imageField('photo', 'Foto', { description: 'Facoltativa. Pubblicare solo con il consenso della persona.' }),
    defineField({ name: 'order', title: 'Ordine', type: 'number' }),
  ],
  preview: { select: { title: 'name', subtitle: 'role.it', media: 'photo' } },
})

export const galleryAlbum = defineType({
  name: 'galleryAlbum',
  title: 'Galleria',
  type: 'document',
  icon: Images,
  fields: [
    defineField({ name: 'title', title: 'Titolo album', type: 'localeString', validation: (rule) => rule.required() }),
    slugField,
    defineField({ name: 'date', title: 'Data', type: 'date' }),
    defineField({ name: 'description', title: 'Descrizione', type: 'localeText' }),
    imageField('cover', 'Copertina', { description: 'Se vuota viene usata la prima foto.' }),
    defineField({
      name: 'images',
      title: 'Foto',
      type: 'array',
      description: 'Pubblica solo foto per cui le persone ritratte hanno dato il consenso (specialmente minori).',
      options: { layout: 'grid' },
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Testo alternativo', type: 'string' }),
            defineField({ name: 'caption', title: 'Didascalia', type: 'localeString' }),
          ],
        }),
      ],
    }),
  ],
  preview: { select: { title: 'title.it', subtitle: 'date', media: 'cover' } },
})

export const transparencyDocument = defineType({
  name: 'transparencyDocument',
  title: 'Documenti (trasparenza)',
  type: 'document',
  icon: FileDown,
  fields: [
    defineField({ name: 'title', title: 'Titolo', type: 'localeString', validation: (rule) => rule.required() }),
    defineField({
      name: 'kind',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Statuto', value: 'statute' },
          { title: 'Atto costitutivo', value: 'deed' },
          { title: 'Bilancio / rendiconto', value: 'budget' },
          { title: 'Relazione attività', value: 'report' },
          { title: 'Altro', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'year', title: 'Anno', type: 'number' }),
    defineField({
      name: 'file',
      title: 'File (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'title.it', subtitle: 'year' } },
})

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Pagine legali',
  type: 'document',
  icon: BookOpen,
  description: 'Privacy policy e altre pagine istituzionali.',
  fields: [
    defineField({ name: 'title', title: 'Titolo', type: 'localeString', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Usa "privacy" per l’informativa sulla privacy.',
      options: { source: 'title.it' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'body', title: 'Testo', type: 'localeBlockContent' }),
  ],
  preview: { select: { title: 'title.it', subtitle: 'slug.current' } },
})
