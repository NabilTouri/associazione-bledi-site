import { House, Settings, Users } from 'lucide-react'
import type { StructureResolver } from 'sanity/structure'

/** Studio sidebar: singletons first, then content grouped by who edits it. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenuti')
    .items([
      S.listItem()
        .title('Pagine fisse')
        .child(
          S.list()
            .title('Pagine fisse')
            .items([
              S.listItem().title('Home page').icon(House).child(S.document().schemaType('homePage').documentId('homePage')),
              S.listItem().title('Chi siamo').icon(Users).child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.documentTypeListItem('legalPage').title('Pagine legali'),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem('post').title('Notizie e annunci'),
      S.documentTypeListItem('event').title('Eventi'),
      S.documentTypeListItem('galleryAlbum').title('Galleria'),
      S.documentTypeListItem('activity').title('Attività e servizi'),
      S.divider(),
      S.documentTypeListItem('boardMember').title('Direttivo'),
      S.documentTypeListItem('transparencyDocument').title('Documenti (trasparenza)'),
      S.documentTypeListItem('submission').title('Richieste dal sito'),
      S.divider(),
      S.listItem().title('Impostazioni del sito').icon(Settings).child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
