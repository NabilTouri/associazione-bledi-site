# Associazione Bledi – sito web

Sito dell'associazione della comunità algerina di Brescia, in **italiano, arabo e francese**.
I contenuti (notizie, eventi, attività, galleria, documenti…) si gestiscono da **Sanity Studio**,
senza toccare il codice. Ogni push su `main` va in produzione su **Vercel**; ogni altro branch
ottiene un'anteprima con un indirizzo proprio.

| Cosa             | Dove                                                 |
| ---------------- | ---------------------------------------------------- |
| Sito             | `https://<dominio>/it` (o `/ar`, `/fr`)              |
| CMS (redazione)  | `https://<dominio>/studio`                           |
| Cose da fare     | [`BACKLOG.md`](BACKLOG.md)                           |
| Guida redattori  | [`docs/guida-redattori.md`](docs/guida-redattori.md) |
| Messa online     | [`docs/deploy.md`](docs/deploy.md)                   |
| Come contribuire | [`CONTRIBUTING.md`](CONTRIBUTING.md)                 |

## Pagine

| Percorso       | Contenuto                                                                                                                    | Stato                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `/`            | Home: chi siamo, come operiamo, prossimi eventi, notizie, orari di preghiera (Brescia e Algeri) e ora in Algeria, dove siamo | ✅                                                     |
| `/chi-siamo`   | Missione, storia, valori, direttivo                                                                                          | ✅                                                     |
| `/notizie`     | Notizie e annunci (con "in evidenza")                                                                                        | ✅                                                     |
| `/eventi`      | Eventi in programma e passati, aggiunta al calendario (Google / .ics)                                                        | ✅                                                     |
| `/attivita`    | Corsi e servizi                                                                                                              | ⚠️ attività non ancora attive, mostrate con avviso     |
| `/galleria`    | Album fotografici                                                                                                            | ✅                                                     |
| `/dona`        | Donazioni singole e mensili                                                                                                  | ⚠️ **demo**: percorso completo, nessun pagamento reale |
| `/associati`   | Richiesta di adesione come socio / volontario                                                                                | ✅ (salvata nello Studio)                              |
| `/trasparenza` | Documenti, stato RUNTS, 5×1000                                                                                               | ⚠️ RUNTS non ancora effettuato, mostrato con avviso    |
| `/contatti`    | Modulo contatti, indirizzo, mappa, social                                                                                    | ✅                                                     |
| `/privacy`     | Informativa privacy                                                                                                          | ⚠️ bozza da far approvare                              |

Finché Sanity non è collegato, ogni pagina mostra **contenuti di esempio** segnalati da un avviso.

### Cosa si modifica dallo Studio e cosa nel codice

| Nello Studio (redazione, senza deploy)                                                      | Nel codice (`src/messages/*.json`, con una PR)              |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Notizie, eventi, galleria, attività, direttivo, documenti                                   | Pulsanti, menu, etichette ed errori dei moduli              |
| Home: etichetta, titolo, testi, riquadri, "Fai parte della comunità"                        | Passaggi del percorso di donazione                          |
| Chi siamo, pagine legali                                                                    | Nomi delle preghiere, pagina 404                            |
| Donazioni: avviso demo, impatto degli importi, bonifico, 5×1000, detraibilità, volontariato | Testi di riserva usati quando un campo dello Studio è vuoto |
| Trasparenza: avviso RUNTS, "Cosa pubblicheremo"                                             |                                                             |
| Impostazioni: contatti, sede, social, IBAN, stato RUNTS, pagamenti attivi                   |                                                             |

## Tecnologie

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) + TypeScript + Tailwind CSS 4
- [Sanity](https://www.sanity.io) come CMS, con lo Studio integrato su `/studio`
- Traduzioni: file `src/messages/{it,ar,fr}.json` per l'interfaccia, campi tradotti in Sanity per i contenuti
- Orari di preghiera calcolati nel browser con [adhan](https://github.com/batoulapps/adhan-js) (nessuna API esterna)
- Test: [Vitest](https://vitest.dev) (unitari) e [Playwright](https://playwright.dev) (end-to-end, desktop e mobile)
- CI: GitHub Actions · Deploy: Vercel

## Sviluppo in locale

Requisiti: Node 22+ e pnpm (`corepack enable`).

```bash
pnpm install
```

```bash
cp .env.example .env.local
```

```bash
pnpm dev
```

Il sito è su http://localhost:3000, lo Studio su http://localhost:3000/studio (serve
`NEXT_PUBLIC_SANITY_PROJECT_ID` e `http://localhost:3000` tra le origini CORS del progetto Sanity).

### Comandi

| Comando         | Cosa fa                              |
| --------------- | ------------------------------------ |
| `pnpm dev`      | Server di sviluppo                   |
| `pnpm build`    | Build di produzione                  |
| `pnpm start`    | Avvia la build di produzione         |
| `pnpm check`    | Lint + controllo tipi + test unitari |
| `pnpm test`     | Test unitari                         |
| `pnpm test:e2e` | Test end-to-end (prima `pnpm build`) |
| `pnpm format`   | Formatta il codice con Prettier      |

Un hook pre-commit (Husky + lint-staged) formatta e controlla i file modificati.

## Struttura

```
src/
  app/
    [locale]/            pagine pubbliche (it, ar, fr)
    studio/              Sanity Studio
    api/revalidate/      webhook Sanity → aggiorna la cache delle pagine
  components/            interfaccia (layout, ui, contenuti, moduli, donazioni, widget)
  i18n/                  lingue e dizionari
  messages/              testi dell'interfaccia in it/ar/fr
  lib/                   logica: azioni dei moduli, pagamenti, orari di preghiera, calendario, validazione
  sanity/
    schemaTypes/         modelli dei contenuti (cosa vede la redazione nello Studio)
    lib/                 client, query GROQ, tipi, funzioni di lettura
  proxy.ts               reindirizza `/` alla lingua del browser
e2e/                     test Playwright
sanity.config.ts         configurazione dello Studio
```

### Come funzionano i contenuti

1. La redazione pubblica un documento nello Studio.
2. Sanity chiama il webhook `/api/revalidate` con il tipo del documento (es. `event`).
3. Il sito invalida solo le pagine che mostrano quel tipo; la visita successiva le rigenera.

Le pagine sono statiche e in cache: veloci e senza costi per ogni visita.

### Aggiungere una lingua

1. Aggiungere il codice in `src/i18n/config.ts`.
2. Creare `src/messages/<codice>.json` (stesse chiavi di `it.json`: un test lo verifica).
3. Aggiungere la lingua in `src/sanity/schemaTypes/objects/localized.ts`.

### Attivare i pagamenti reali

Il codice usa un'interfaccia `PaymentProvider` (`src/lib/payments/`). Oggi esiste solo il
provider demo; per Stripe basta implementare l'interfaccia e selezionarla con `PAYMENT_PROVIDER`.
Dettagli in [`BACKLOG.md`](BACKLOG.md).
