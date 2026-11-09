# Backlog

Cose da fare, in ordine di priorità indicativo. Quando un punto è chiuso, spuntalo nella PR che lo completa.

Legenda: 🧑‍💼 decisione o azione dell'associazione · 🛠️ lavoro tecnico · ✍️ contenuti (redazione)

## Da fare prima della messa online

- [ ] 🧑‍💼 Creare il progetto Sanity e l'account Vercel dell'associazione (vedi [`docs/deploy.md`](docs/deploy.md))
- [ ] 🧑‍💼 Scegliere e acquistare il dominio (es. `associazionebledi.it`), collegarlo a Vercel, aggiornare `NEXT_PUBLIC_SITE_URL`
- [ ] ✍️ Inserire nello Studio i dati reali in **Impostazioni del sito**: indirizzo, coordinate, email, telefono, social
- [ ] ✍️ Scrivere i testi di **Home page** e **Chi siamo** (storia vera, missione, valori) nelle tre lingue
- [ ] ✍️ Inserire il direttivo (con consenso per eventuali foto)
- [ ] ✍️ Rivedere nello Studio i testi di **Pagina Donazioni** e **Pagina Trasparenza** (oggi il sito usa i testi predefiniti)
- [ ] 🧑‍💼 Far approvare l'**informativa privacy** definitiva e pubblicarla come _Pagina legale_ con slug `privacy`
- [ ] 🧑‍💼 Logo e identità visiva definitivi (oggi c'è un logo provvisorio in `src/components/ui/Logo.tsx` e `src/app/icon.svg`)
- [ ] 🧑‍💼 Far rileggere le traduzioni in arabo e francese da madrelingua

## Donazioni — oggi in modalità demo

La pagina `/dona` mostra il percorso completo (importo, una tantum/mensile, dati, pagamento, conferma)
ma **non incassa nulla**: è visibile l'avviso "Modalità dimostrativa".

- [ ] 🧑‍💼 Decidere il fornitore: **Stripe** consigliato (carta, Apple/Google Pay, SEPA, donazioni ricorrenti come abbonamenti); alternativa PayPal
- [ ] 🧑‍💼 Aprire il conto corrente dell'associazione e l'account del fornitore a nome dell'associazione
- [ ] 🛠️ Implementare `StripeProvider` in `src/lib/payments/` (Stripe Checkout: `mode: 'payment'` per una tantum, `mode: 'subscription'` per mensile) e selezionarlo con `PAYMENT_PROVIDER=stripe`
- [ ] 🛠️ Webhook Stripe → salvare le donazioni (es. documento `donation` in Sanity o solo dashboard Stripe) e inviare ricevuta
- [ ] 🛠️ Pagina/portale per gestire o annullare le donazioni mensili (Stripe Customer Portal)
- [ ] ✍️ Pubblicare l'IBAN in _Impostazioni del sito_ (compare subito nella sezione "Bonifico")
- [ ] ✍️ Attivare "Pagamenti online attivi" nelle impostazioni quando tutto è pronto (toglie l'avviso demo)

## Terzo settore (RUNTS) — non ancora iscritti

Le sezioni 5×1000, detraibilità e trasparenza esistono già ma mostrano "Non ancora disponibile".

- [ ] 🧑‍💼 Valutare la forma giuridica (APS / ODV / ETS) e completare l'iscrizione al **RUNTS**
- [ ] ✍️ Dopo l'iscrizione: impostare _Stato iscrizione RUNTS = Iscritta_, numero RUNTS e codice fiscale nelle impostazioni (gli avvisi spariscono da soli)
- [ ] 🧑‍💼 Accreditamento al **5×1000**
- [ ] ✍️ Pubblicare statuto, atto costitutivo, bilanci/rendiconti nella sezione _Documenti (trasparenza)_
- [ ] 🛠️ Ricevute fiscali per le donazioni detraibili (dopo l'iscrizione)

## Attività e servizi — non ancora attive

La pagina `/attivita` elenca le attività previste con l'avviso "Attività non ancora attive".

- [ ] 🧑‍💼 Definire quali attività partono davvero (corso di arabo per bambini, italiano per nuovi arrivati, sportello informativo, spazio giovani…)
- [ ] ✍️ Crearle nello Studio (_Attività e servizi_) con orari e stato **Attiva**: l'avviso sparisce quando tutte sono attive
- [ ] 🛠️ (opzionale) Iscrizione online alle attività

## Moduli (contatti e adesione)

Le richieste vengono salvate nello Studio in _Richieste dal sito_ se `SANITY_API_WRITE_TOKEN` è impostato,
altrimenti il sito risponde in modalità demo.

- [ ] 🛠️ Notifica email alla segreteria per ogni nuova richiesta (es. [Resend](https://resend.com))
- [ ] 🛠️ Email di conferma a chi scrive
- [ ] 🛠️ Protezione anti-spam più forte se serve (Cloudflare Turnstile, limite di invii per IP); oggi c'è un campo trappola invisibile
- [ ] 🧑‍💼 Decidere per quanto tempo conservare le richieste (GDPR) e cancellarle periodicamente

## Miglioramenti tecnici

- [ ] 🛠️ Anteprima delle bozze nello Studio (Draft Mode + Presentation tool / Visual Editing)
- [ ] 🛠️ Tipi TypeScript generati automaticamente dagli schemi (`sanity typegen`) al posto di `src/sanity/lib/types.ts`
- [ ] 🛠️ Immagini Open Graph generate per eventi e notizie (`opengraph-image.tsx`)
- [ ] 🛠️ Ricerca nelle notizie e filtro per categoria; paginazione quando i contenuti crescono
- [ ] 🛠️ Newsletter (es. Brevo / Mailchimp) con iscrizione dal sito
- [ ] 🛠️ Statistiche rispettose della privacy (Vercel Web Analytics, senza cookie)
- [ ] 🛠️ Calendario Hijri e ricorrenze (Ramadan, Aïd) accanto agli orari di preghiera
- [ ] 🛠️ Test e2e anche contro l'anteprima Vercel (`E2E_BASE_URL`) e audit di accessibilità automatico (axe)
- [ ] 🛠️ Tema scuro
- [ ] 🛠️ Visualizzazione a schermo intero delle foto della galleria (oggi la foto si apre in una nuova scheda)

## Fatto

- [x] Sito in tre lingue (it, ar con layout da destra a sinistra, fr)
- [x] CMS Sanity integrato su `/studio` con ruoli separati sviluppo / redazione
- [x] Notizie e annunci, eventi con calendario, galleria, attività, trasparenza, direttivo
- [x] Percorso donazione completo in modalità demo, predisposto per Stripe
- [x] Moduli contatti e adesione con validazione e salvataggio nello Studio
- [x] Orari di preghiera Brescia e Algeri, ora attuale in Algeria
- [x] Testi editoriali di Donazioni, Trasparenza e Home spostati nello Studio (con i testi del codice come riserva)
- [x] Selettore della lingua, menu mobile, checkbox, radio e campo "Altro importo" nello stile del sito, accessibili da tastiera
- [x] CI su GitHub Actions (lint, tipi, test unitari, build, test end-to-end) e deploy Vercel con anteprime per branch
