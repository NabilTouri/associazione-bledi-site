import { HandHeart, Scale } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

/** A card with a translated title and text (e.g. "Bonifico bancario"). */
function cardField(name: string, title: string, group: string, description?: string) {
  return defineField({
    name,
    title,
    group,
    description,
    type: 'object',
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({ name: 'title', title: 'Titolo', type: 'localeString' }),
      defineField({ name: 'text', title: 'Testo', type: 'localeText' }),
    ],
  })
}

export const donatePage = defineType({
  name: 'donatePage',
  title: 'Pagina Donazioni',
  type: 'document',
  icon: HandHeart,
  groups: [
    { name: 'demo', title: 'Avviso demo', default: true },
    { name: 'impact', title: 'Impatto degli importi' },
    { name: 'otherWays', title: 'Altri modi per sostenerci' },
  ],
  fields: [
    defineField({
      name: 'demoTitle',
      title: 'Titolo dell’avviso "Modalità dimostrativa"',
      type: 'localeString',
      group: 'demo',
      description: 'Visibile finché i pagamenti online non sono attivi (vedi Impostazioni del sito).',
    }),
    defineField({ name: 'demoText', title: 'Testo dell’avviso', type: 'localeText', group: 'demo' }),
    defineField({
      name: 'impact',
      title: 'Cosa permette ogni importo',
      type: 'object',
      group: 'impact',
      description: 'Frase mostrata quando il donatore sceglie l’importo.',
      fields: [
        defineField({ name: 'amount10', title: '10 €', type: 'localeString' }),
        defineField({ name: 'amount25', title: '25 €', type: 'localeString' }),
        defineField({ name: 'amount50', title: '50 €', type: 'localeString' }),
        defineField({ name: 'amount100', title: '100 €', type: 'localeString' }),
      ],
    }),
    cardField('bank', 'Bonifico bancario', 'otherWays', 'L’IBAN si inserisce nelle Impostazioni del sito.'),
    cardField('fiveXMille', '5×1000', 'otherWays', 'Il codice fiscale compare dopo l’iscrizione al RUNTS (Impostazioni del sito).'),
    cardField('tax', 'Detraibilità fiscale', 'otherWays'),
    cardField('volunteer', 'Dona il tuo tempo', 'otherWays'),
  ],
  preview: { prepare: () => ({ title: 'Pagina Donazioni' }) },
})

export const transparencyPage = defineType({
  name: 'transparencyPage',
  title: 'Pagina Trasparenza',
  type: 'document',
  icon: Scale,
  fields: [
    defineField({
      name: 'runtsTitle',
      title: 'Titolo dell’avviso RUNTS',
      type: 'localeString',
      description: 'Visibile finché lo stato RUNTS (Impostazioni del sito) non è "Iscritta".',
    }),
    defineField({ name: 'runtsText', title: 'Testo dell’avviso RUNTS', type: 'localeText' }),
    defineField({
      name: 'planned',
      title: 'Cosa pubblicheremo',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Voce', type: 'localeString' }),
            defineField({
              name: 'done',
              title: 'Già pubblicato',
              type: 'boolean',
              initialValue: false,
              description: 'Mostra la spunta verde accanto alla voce.',
            }),
          ],
          preview: {
            select: { title: 'label.it', done: 'done' },
            prepare: ({ title, done }) => ({ title, subtitle: done ? '✓ pubblicato' : 'da pubblicare' }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Pagina Trasparenza' }) },
})
