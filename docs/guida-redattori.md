# Guida per la redazione

Questa guida è per chi inserisce eventi, notizie e foto. **Non serve saper programmare.**

## Accesso

Vai su `https://<dominio>/studio` ed entra con l'account con cui sei stato invitato.
A sinistra trovi l'elenco dei contenuti.

## Le tre lingue

Ogni testo ha tre caselle: **Italiano** (obbligatorio), **العربية** e **Français** (nella sezione _Traduzioni_).
Se una traduzione manca, il sito mostra il testo italiano. Meglio comunque compilarle tutte.

## Pubblicare

Le modifiche restano in **bozza** finché non premi **Publish** (in basso a destra). Dopo la pubblicazione
il sito si aggiorna da solo in pochi secondi.

## Cosa trovi nello Studio

| Sezione                          | A cosa serve                                                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Pagine fisse → Home page**     | Etichetta sopra il titolo, titolo e testi della home, riquadri "Come operiamo", riquadro "Fai parte della comunità"                |
| **Pagine fisse → Chi siamo**     | Missione, storia, valori                                                                                                           |
| **Pagine fisse → Donazioni**     | Avviso "Modalità dimostrativa", frasi sull'impatto di 10/25/50/100 €, riquadri bonifico, 5×1000, detraibilità, "Dona il tuo tempo" |
| **Pagine fisse → Trasparenza**   | Avviso sull'iscrizione al RUNTS, elenco "Cosa pubblicheremo" (con spunta per le voci già pubblicate)                               |
| **Pagine fisse → Pagine legali** | Informativa privacy (slug `privacy`)                                                                                               |
| **Notizie e annunci**            | Articoli. _Annuncio_ = comunicazione importante (in rosso). _In evidenza_ = sempre in cima                                         |
| **Eventi**                       | Data, luogo, locandina, descrizione, link di iscrizione                                                                            |
| **Galleria**                     | Album di foto                                                                                                                      |
| **Attività e servizi**           | Corsi e servizi. Lo stato _In progettazione_ mostra l'avviso "non ancora attiva"                                                   |
| **Direttivo**                    | Membri del direttivo con ruolo                                                                                                     |
| **Documenti (trasparenza)**      | Statuto, bilanci, relazioni in PDF                                                                                                 |
| **Richieste dal sito**           | Messaggi dal modulo contatti e richieste di adesione. Cambia lo stato in _Gestita_ quando hai risposto                             |
| **Impostazioni del sito**        | Indirizzo, contatti, social, IBAN, stato RUNTS, pagamenti                                                                          |

## Testi che si cambiano dallo Studio e testi fissi

Se un campo dello Studio è vuoto, il sito mostra il testo predefinito: puoi riempire i campi poco alla volta.

Restano invece nel codice (e si cambiano con una richiesta a chi sviluppa) i testi dell'interfaccia:
pulsanti, menu, etichette ed errori dei moduli, passaggi del percorso di donazione, nomi delle preghiere,
pagina "non trovata".

### Pagina Donazioni

- **Avviso demo**: titolo e testo del riquadro viola in cima alla pagina. Il riquadro sparisce da solo quando
  in _Impostazioni del sito_ attivi "Pagamenti online attivi" (solo quando il pagamento reale è pronto).
- **Impatto degli importi**: la frase che compare scegliendo 10, 25, 50 o 100 €.
- **Altri modi per sostenerci**: titolo e testo di ogni riquadro.
  - _Bonifico_: finché l'IBAN non è inserito nelle _Impostazioni del sito_ compare "In arrivo";
    quando c'è l'IBAN, il testo (se presente) appare sopra il codice IBAN.
  - _5×1000_ e _Detraibilità_: compare "Non ancora disponibile" finché lo stato RUNTS non è "Iscritta".

### Pagina Trasparenza

- **Avviso RUNTS**: visibile finché nelle _Impostazioni del sito_ lo stato RUNTS non è "Iscritta".
- **Cosa pubblicheremo**: aggiungi, togli o riordina le voci; attiva _Già pubblicato_ per mostrare la spunta verde.

## Creare un evento

1. **Eventi → +** (in alto).
2. Compila **Titolo** (italiano obbligatorio), poi premi **Generate** accanto a _Indirizzo della pagina_.
3. Inserisci **Inizio** e, se vuoi, **Fine**.
4. **Luogo** e **Indirizzo**: compaiono nella pagina e nel link "Aggiungi al calendario".
5. **Riassunto**: una o due frasi per l'anteprima.
6. **Locandina**: carica l'immagine e trascina il punto di interesse (_hotspot_) sulla parte importante.
7. **Publish**.

Gli eventi passati si spostano da soli nella sezione "Eventi passati".

## Buone pratiche

- **Immagini**: JPG o PNG di almeno 1600 px di larghezza. Compila sempre il _Testo alternativo_ (descrizione per chi non vede l'immagine).
- **Foto di persone**: pubblica solo con il consenso delle persone ritratte, e dei genitori per i minori.
- **Indirizzo della pagina (slug)**: non cambiarlo dopo la pubblicazione, altrimenti i link condivisi smettono di funzionare.
- **Dati personali**: non incollare nei testi pubblici dati presi dalle _Richieste dal sito_.

## Problemi?

Se qualcosa non si aggiorna dopo qualche minuto o vedi un errore, scrivi a chi gestisce il sito
indicando la pagina e cosa hai fatto.
