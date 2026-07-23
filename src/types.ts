// Tipi condivisi dell'app flashcard.

export type GruppoId = 'gram-pos' | 'gram-pos-spore' | 'gram-neg'

export interface Gruppo {
  id: GruppoId
  nome: string
  colore: string
}

export interface Sezione {
  titolo: string
  punti: string[]
}

/** Una flashcard: `nome` = fronte, `sezioni` = retro. */
export interface Card {
  id: string
  nome: string
  gruppo: GruppoId
  sezioni: Sezione[]
}

export interface Meta {
  titolo: string
  fonte: string
  lingua: string
  descrizione: string
}

export interface Dataset {
  meta: Meta
  gruppi: Gruppo[]
  cards: Card[]
}

/** Stato di studio per singola carta (sistema Leitner). */
export interface CardState {
  /** Box corrente, 1..5. Box basso = da ripassare spesso. */
  box: number
  corrette: number
  sbagliate: number
  vistaCount: number
  /** timestamp (ms) dell'ultima volta che la carta è stata giudicata. */
  ultimaVista: number | null
}

export type StatiStudio = Record<string, CardState>

export type Filtro = GruppoId | 'tutti'
