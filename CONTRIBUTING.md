# Come contribuire

## Chi fa cosa

- **Redazione** (eventi, notizie, foto, testi delle pagine): lavora solo nello **Studio** (`/studio`).
  Vedi [`docs/guida-redattori.md`](docs/guida-redattori.md). Nessun accesso a GitHub necessario.
- **Sviluppo** (codice, grafica, nuove funzioni): lavora su GitHub seguendo il flusso qui sotto.
- **Testi dell'interfaccia** (bottoni, etichette, messaggi): sono nel codice, in `src/messages/{it,ar,fr}.json`.
  Si modificano con una Pull Request, anche direttamente dall'editor web di GitHub.

## Flusso di lavoro

1. Crea un branch da `main` con un nome chiaro:
   - `feature/iscrizione-attivita` per nuove funzioni
   - `fix/menu-mobile` per correzioni
   - `content/testi-arabo` per testi e traduzioni
2. Fai commit piccoli con messaggi chiari, in stile [Conventional Commits](https://www.conventionalcommits.org/it/):
   `feat: aggiunge iscrizione alle attività`, `fix: corregge il menu su mobile`.
3. Fai push: Vercel crea un'**anteprima** e GitHub Actions esegue i test.
4. Apri una **Pull Request** verso `main`, compila il modello, allega il link dell'anteprima.
5. Quando i controlli sono verdi e la PR è approvata, fai **merge**: il sito in produzione si aggiorna.

## Prima di fare push

```bash
pnpm check
```

Per modifiche all'interfaccia esegui anche i test end-to-end:

```bash
pnpm build && pnpm test:e2e
```

## Regole del codice

- TypeScript rigoroso, niente `any`.
- Ogni testo visibile va in **tutte e tre** le lingue (`src/messages/*.json`); un test controlla che le chiavi coincidano.
- Usa proprietà CSS logiche (`ms-*`, `me-*`, `start-*`, `end-*`) invece di `ml-*`/`left-*`, così il layout arabo funziona da solo.
- Nuovi tipi di contenuto: schema in `src/sanity/schemaTypes/`, query in `src/sanity/lib/queries.ts`,
  funzione in `src/sanity/lib/data.ts` con il tag uguale al `_type` (serve all'aggiornamento automatico).
- Funzioni non ancora reali: mostrale con il componente `Notice` e aggiungi il punto in [`BACKLOG.md`](BACKLOG.md).
- Segreti (token, chiavi) solo nelle variabili d'ambiente, mai nel codice.
