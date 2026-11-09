import { Inbox } from 'lucide-react'
import { defineField, defineType } from 'sanity'

/**
 * Messages sent from the website forms (contact, membership).
 * Created by the server with a write token; editors only change `status`.
 */
export const submission = defineType({
  name: 'submission',
  title: 'Richieste dal sito',
  type: 'document',
  icon: Inbox,
  fields: [
    defineField({
      name: 'status',
      title: 'Stato',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'Nuova', value: 'new' },
          { title: 'In gestione', value: 'in_progress' },
          { title: 'Gestita', value: 'done' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'kind',
      title: 'Tipo',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Contatto', value: 'contact' },
          { title: 'Adesione', value: 'membership' },
        ],
      },
    }),
    defineField({ name: 'name', title: 'Nome', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Telefono', type: 'string', readOnly: true }),
    defineField({ name: 'subject', title: 'Oggetto', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Messaggio', type: 'text', readOnly: true }),
    defineField({ name: 'details', title: 'Dettagli', type: 'text', readOnly: true }),
    defineField({ name: 'locale', title: 'Lingua del sito', type: 'string', readOnly: true }),
    defineField({ name: 'internalNotes', title: 'Note interne', type: 'text', description: 'Visibili solo nello Studio.' }),
  ],
  orderings: [{ title: 'Più recenti', name: 'createdDesc', by: [{ field: '_createdAt', direction: 'desc' }] }],
  preview: {
    select: { name: 'name', kind: 'kind', status: 'status', subject: 'subject' },
    prepare: ({ name, kind, status, subject }) => ({
      title: name ?? 'Senza nome',
      subtitle: [
        kind === 'membership' ? 'Adesione' : 'Contatto',
        subject,
        status === 'new' ? '● nuova' : status === 'done' ? 'gestita' : 'in gestione',
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
