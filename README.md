# Batteriologia · Flashcards

Web app di flashcard per lo studio della batteriologia. Fronte della carta = nome del
batterio; retro = tutte le informazioni (caratteristiche, virulenza, patologie, diagnosi,
terapia…). Ripasso a **ripetizione dilazionata** con sistema di **Leitner pesato**: le carte
sbagliate ricompaiono più spesso, quelle sapute più di rado.

56 schede, 3 gruppi con codifica colore della **colorazione di Gram**:

- **Gram +** → viola (il cristal violetto trattenuto)
- **Gram + sporigeni** → indaco
- **Gram −** → rosa/magenta (safranina)

Interfaccia in stile "quaderno clinico": sfondo bianco, **verde** = carte sapute / progresso,
**rosso** = da rivedere; i tag dei gruppi usano i colori della colorazione di Gram. Tema scuro
disponibile col toggle in alto a destra.

Interamente client-side (nessun backend). Lo stato di studio è salvato nel browser
(`localStorage`), quindi lo studio riprende da dove l'hai lasciato.

---

## Requisiti

- [Node.js](https://nodejs.org) 20 o superiore (testato su Node 24)

## Comandi

```bash
npm install      # installa le dipendenze (una volta sola)
npm run dev      # avvia in locale su http://localhost:5173
npm run build    # build di produzione nella cartella dist/
npm run preview  # anteprima locale della build di produzione
```

## Come si usa

- **Tocca/clicca la carta** per girarla e vedere la risposta.
- Dopo il flip si attivano due pulsanti:
  - **✗ Da rivedere** → la carta torna a comparire spesso.
  - **✓ Lo sapevo** → la carta si dirada.
- Premendo ✗ o ✓ si registra l'esito e si passa alla carta successiva.
  Per saltare senza registrare nulla usa **Salta** (in alto sulla carta).
- **Filtri** in alto: `Tutti · Gram + · Gram + sporigeni · Gram −`.
- **Reset progressi**: icona in alto a destra (con conferma).

### Scorciatoie da tastiera (desktop)

| Tasto              | Azione        |
| ------------------ | ------------- |
| `Spazio` / `Invio` | gira la carta |
| `1` / `←`          | Da rivedere   |
| `2` / `→`          | Lo sapevo     |
| `↑`                | salta         |

---

## Come funziona il ripescaggio (Leitner pesato)

Ogni carta ha uno stato `{ box: 1..5, corrette, sbagliate, vistaCount, ultimaVista }`.
Tutte partono da `box = 1`.

- **✓ Lo sapevo** → `box = min(box + 1, 5)`
- **✗ Da rivedere** → `box = 1`
- Peso di estrazione in funzione del box (box basso = compare più spesso):
  `{ 1:32, 2:16, 3:8, 4:4, 5:2 }`
- La carta successiva è scelta con **estrazione casuale pesata** sull'intero mazzo attivo,
  evitando di ripescare quella appena vista.
- Una carta è **padroneggiata** quando raggiunge `box 5`. La % di padronanza del mazzo =
  carte in box 5 / totale del mazzo attivo.

Tutta la logica è isolata in [`src/lib/spacedRepetition.ts`](src/lib/spacedRepetition.ts)
(modulo puro e testabile). Per passare in futuro a un algoritmo più avanzato (SM-2 / FSRS)
basta sostituire `selezionaProssima()` senza toccare la UI.

## Contenuti / dati

I contenuti sono la **fonte unica** in
[`src/data/flashcards-data.json`](src/data/flashcards-data.json) e vengono importati
staticamente. Per correggere o aggiungere una scheda basta modificare il JSON:

```jsonc
{
  "id": "identificativo-univoco",
  "nome": "Nome del batterio",     // fronte
  "gruppo": "gram-pos",            // gram-pos | gram-pos-spore | gram-neg
  "sezioni": [                       // retro
    { "titolo": "Caratteristiche", "punti": ["...", "..."] }
  ]
}
```

## Struttura del progetto

```
src/
  data/flashcards-data.json   Contenuti (56 carte)
  lib/spacedRepetition.ts     Algoritmo Leitner pesato (puro)
  hooks/
    useSpacedRepetition.ts    Stato di studio, selezione, persistenza
    useTheme.ts               Tema chiaro/scuro
  components/
    Card.tsx                  Flashcard con flip 3D
    Controls.tsx              Pulsanti ✗ / ✓
    StatsBar.tsx              Statistiche live + barra di padronanza
    FilterBar.tsx             Filtri per gruppo
    ShortcutsHint.tsx         Legenda scorciatoie
  App.tsx                     Composizione, tastiera, feedback
  index.css                   Design system (tema, flip 3D, animazioni)
```

Stack: **React + Vite + TypeScript + Tailwind CSS**, icone `lucide-react`. Nessun backend.

---

## Pubblicazione

`npm run build` produce **un unico file** `dist/index.html`, con CSS e JS già incorporati (l'unica
risorsa esterna sono i font Google: serve la connessione, altrimenti usa font di sistema di riserva).
Non serve né GitHub né Vercel: basta un qualsiasi hosting di file statici.

**Il modo più semplice (senza GitHub)**

1. Vai su [Netlify Drop](https://app.netlify.com/drop).
2. Trascina il file `dist/index.html` (o l'intera cartella `dist`).
3. Ottieni un link pubblico `https://…netlify.app`: è già il tuo sito, condivisibile.

Vanno bene allo stesso modo Vercel (`npm i -g vercel && vercel --prod`), GitHub Pages, o
qualunque spazio web su cui puoi caricare un file.

**Dentro GoHighLevel (GHL)**

GHL non ospita una pagina HTML "grezza", ma puoi incorporare l'app ospitata altrove con un iframe.
Dopo aver ottenuto il link (es. da Netlify), in GHL aggiungi un elemento **Custom Code / HTML** con:

```html
<iframe src="https://IL-TUO-LINK" title="Batteriologia" style="width:100%;height:100vh;border:0"></iframe>
```

(Incollare l'intero HTML direttamente nel blocco codice di GHL è meno affidabile — meglio l'iframe.)
