/**
 * Ripescaggio a ripetizione dilazionata — sistema di Leitner pesato.
 *
 * Modulo puro e isolato: nessuna dipendenza da React o dal DOM.
 * Per sostituire l'algoritmo (es. SM-2 / FSRS in futuro) basta cambiare
 * `selezionaProssima` e le funzioni di aggiornamento box, senza toccare la UI.
 */
import type { Card, CardState, StatiStudio } from '../types'

export const BOX_MIN = 1
export const BOX_MAX = 5

/** Peso di estrazione per box: box basso = compare più spesso. */
export const PESI: Record<number, number> = { 1: 32, 2: 16, 3: 8, 4: 4, 5: 2 }

export function statoIniziale(): CardState {
  return { box: BOX_MIN, corrette: 0, sbagliate: 0, vistaCount: 0, ultimaVista: null }
}

/** Verifica che uno stato salvato sia ben formato (difende da localStorage manomesso/legacy). */
function statoValido(s: unknown): s is CardState {
  if (!s || typeof s !== 'object') return false
  const o = s as Record<string, unknown>
  return (
    typeof o.box === 'number' &&
    Number.isFinite(o.box) &&
    o.box >= BOX_MIN &&
    o.box <= BOX_MAX &&
    typeof o.corrette === 'number' &&
    typeof o.sbagliate === 'number' &&
    typeof o.vistaCount === 'number'
  )
}

/** Costruisce/ripristina lo stato per tutte le carte, riusando solo quello salvato valido. */
export function inizializzaStati(cards: Card[], esistenti: StatiStudio = {}): StatiStudio {
  const stati: StatiStudio = {}
  for (const c of cards) {
    const salvato = esistenti[c.id]
    stati[c.id] = statoValido(salvato) ? salvato : statoIniziale()
  }
  return stati
}

/** ✓ "Lo sapevo": la carta sale di un box (si dirada), fino al massimo. */
export function rispostaCorretta(s: CardState, now: number): CardState {
  return {
    ...s,
    box: Math.min(s.box + 1, BOX_MAX),
    corrette: s.corrette + 1,
    vistaCount: s.vistaCount + 1,
    ultimaVista: now,
  }
}

/** ✗ "Da rivedere": la carta torna al box 1 (ricompare spesso). */
export function rispostaSbagliata(s: CardState, now: number): CardState {
  return {
    ...s,
    box: BOX_MIN,
    sbagliate: s.sbagliate + 1,
    vistaCount: s.vistaCount + 1,
    ultimaVista: now,
  }
}

export function peso(box: number): number {
  return PESI[box] ?? PESI[BOX_MAX]
}

/**
 * Estrazione casuale pesata sull'intero mazzo attivo.
 * Vincolo: non ripescare l'ultima carta vista (salvo mazzo di una sola carta).
 * `rnd` è iniettabile per rendere la funzione testabile in modo deterministico.
 */
export function selezionaProssima(
  mazzo: Card[],
  stati: StatiStudio,
  ultimaId: string | null,
  rnd: () => number = Math.random,
): Card | null {
  if (mazzo.length === 0) return null
  if (mazzo.length === 1) return mazzo[0]

  const candidati = mazzo.filter((c) => c.id !== ultimaId)
  const pool = candidati.length > 0 ? candidati : mazzo

  const pesi = pool.map((c) => peso(stati[c.id]?.box ?? BOX_MIN))
  const totale = pesi.reduce((a, b) => a + b, 0)

  let r = rnd() * totale
  for (let i = 0; i < pool.length; i++) {
    r -= pesi[i]
    if (r < 0) return pool[i]
  }
  return pool[pool.length - 1]
}

/** Numero di carte padroneggiate (box massimo) nel mazzo. */
export function padroneggiate(mazzo: Card[], stati: StatiStudio): number {
  return mazzo.filter((c) => (stati[c.id]?.box ?? BOX_MIN) === BOX_MAX).length
}

/** Percentuale di padronanza del mazzo (0..100). */
export function percentualePadronanza(mazzo: Card[], stati: StatiStudio): number {
  if (mazzo.length === 0) return 0
  return Math.round((padroneggiate(mazzo, stati) / mazzo.length) * 100)
}
