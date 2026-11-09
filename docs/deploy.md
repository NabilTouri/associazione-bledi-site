# Messa online: Sanity + Vercel + GitHub

Guida passo passo da fare **una volta sola**. Tempo stimato: 30–45 minuti.

## Come funziona il flusso

```
branch feature/xyz ──push──▶ GitHub Actions (test) + Vercel Preview (URL di anteprima)
        │
        └── Pull Request ──review + CI verde──▶ merge su main ──▶ Vercel Production (sito pubblico)
```

- **`main` = produzione.** Non si lavora direttamente su `main`.
- **Ogni altro branch** ottiene automaticamente un'anteprima su Vercel con un URL proprio
  (es. `associazione-bledi-site-git-feature-xyz.vercel.app`), da controllare prima del merge.
- I **contenuti** (eventi, notizie…) non passano da GitHub: si pubblicano dallo Studio e il sito si aggiorna da solo.

## 1. Sanity (CMS)

1. Crea un account su [sanity.io](https://www.sanity.io) (meglio con un'email dell'associazione) e un nuovo progetto
   da [sanity.io/manage](https://www.sanity.io/manage). Annota il **Project ID**.
2. Nel progetto, sezione **Datasets**: crea `production` (sito pubblico) e `development` (anteprime e prove).
3. **API → CORS origins**, aggiungi con _Allow credentials_ attivo:
   - `http://localhost:3000`
   - `https://<dominio-di-produzione>`
   - `https://*.vercel.app` (per lo Studio nelle anteprime)
4. **API → Tokens**: crea un token con permessi **Editor**, nome "sito – moduli". È il valore di
   `SANITY_API_WRITE_TOKEN` (serve a salvare le richieste dei moduli). Non condividerlo e non metterlo nel codice.
5. **API → Webhooks**: crea un webhook
   - URL: `https://<dominio-di-produzione>/api/revalidate`
   - Dataset: `production` · Trigger: _Create, Update, Delete_
   - Projection: `{_type, "slug": slug.current}`
   - Secret: una stringa casuale lunga (es. `openssl rand -hex 32`), che sarà `SANITY_REVALIDATE_SECRET`
6. **Members**: invita le persone. Ruoli consigliati:
   - **Editor** per chi inserisce eventi e notizie
   - **Administrator** solo per chi gestisce il progetto

## 2. Vercel (hosting)

1. Crea un account su [vercel.com](https://vercel.com) e collega GitHub.
2. **Add New → Project → Import** la repository `associazione-bledi-site`. Framework e pnpm vengono rilevati da soli.
3. **Settings → Git**: _Production Branch_ = `main`.
4. **Settings → Environment Variables** (vedi anche `.env.example`):

   | Variabile                       | Production          | Preview                         |
   | ------------------------------- | ------------------- | ------------------------------- |
   | `NEXT_PUBLIC_SITE_URL`          | `https://<dominio>` | (vuota: usa l'URL di anteprima) |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID          | Project ID                      |
   | `NEXT_PUBLIC_SANITY_DATASET`    | `production`        | `development`                   |
   | `SANITY_API_WRITE_TOKEN`        | token Editor        | token Editor                    |
   | `SANITY_REVALIDATE_SECRET`      | secret del webhook  | secret del webhook              |
   | `PAYMENT_PROVIDER`              | `mock`              | `mock`                          |

5. **Settings → Domains**: aggiungi il dominio e segui le istruzioni DNS.
6. (Consigliato) **Settings → Deployment Protection**: proteggi le anteprime, così solo il team le vede.

> Le anteprime non vengono indicizzate da Google (`robots.txt` le esclude automaticamente) e rileggono
> i contenuti del dataset `development` ogni pochi minuti (il webhook aggiorna solo la produzione).

## 3. GitHub (regole del branch `main`)

**Settings → Branches → Add branch ruleset** (o _branch protection rule_) per `main`:

- Richiedi una Pull Request prima del merge (almeno 1 approvazione quando il team cresce)
- Richiedi i controlli verdi: **Lint, types and unit tests**, **Build and end-to-end tests** e il deploy **Vercel**
- Blocca i force push

## 4. Verifica finale

- [ ] `https://<dominio>/it` si apre e mostra i contenuti dello Studio (gli avvisi "contenuto di esempio" spariscono)
- [ ] `https://<dominio>/studio` permette il login
- [ ] Pubblica un evento di prova: entro pochi secondi compare in `/it/eventi`
- [ ] Invia il modulo contatti: la richiesta compare nello Studio in _Richieste dal sito_
- [ ] Apri una PR di prova: compaiono i controlli CI e il link all'anteprima Vercel
