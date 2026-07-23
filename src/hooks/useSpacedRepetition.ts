import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Card, Filtro, StatiStudio } from '../types'
import {
  inizializzaStati,
  padroneggiate,
  percentualePadronanza,
  rispostaCorretta,
  rispostaSbagliata,
  selezionaProssima,
  statoIniziale,
} from '../lib/spacedRepetition'

const STORAGE_KEY = 'flashcards-batteriologia:v1'

export type Esito = 'correct' | 'wrong'

interface Persisted {
  stati: StatiStudio
  filtro: Filtro
}

function caricaSalvato(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Persisted>
    if (!parsed || typeof parsed !== 'object' || !parsed.stati) return null
    return { stati: parsed.stati, filtro: (parsed.filtro as Filtro) ?? 'tutti' }
  } catch {
    return null
  }
}

function mazzoPer(cards: Card[], filtro: Filtro): Card[] {
  return filtro === 'tutti' ? cards : cards.filter((c) => c.gruppo === filtro)
}

/**
 * Cuore dell'app: gestisce stato di studio, carta corrente, filtro,
 * statistiche di sessione e persistenza. La logica di ripescaggio è
 * delegata al modulo `spacedRepetition` (facilmente sostituibile).
 */
export function useSpacedRepetition(cards: Card[]) {
  const salvato = useMemo(caricaSalvato, [])

  const [stati, setStati] = useState<StatiStudio>(() =>
    inizializzaStati(cards, salvato?.stati ?? {}),
  )
  const [filtro, setFiltro] = useState<Filtro>(salvato?.filtro ?? 'tutti')

  const mazzo = useMemo(() => mazzoPer(cards, filtro), [cards, filtro])

  const [correnteId, setCorrenteId] = useState<string | null>(
    () => selezionaProssima(mazzo, stati, null)?.id ?? null,
  )

  // Statistiche della sessione corrente (non persistite: azzerate a ogni reload).
  const [vistiSessione, setVistiSessione] = useState(0)
  const [correttiSessione, setCorrettiSessione] = useState(0)
  const [sbagliatiSessione, setSbagliatiSessione] = useState(0)

  const corrente = useMemo(
    () => mazzo.find((c) => c.id === correnteId) ?? null,
    [mazzo, correnteId],
  )

  // Persistenza su localStorage a ogni cambiamento rilevante.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stati, filtro } satisfies Persisted))
    } catch {
      /* localStorage non disponibile: ignora */
    }
  }, [stati, filtro])

  // Al cambio del mazzo (filtro), garantisce una carta corrente valida.
  useEffect(() => {
    setCorrenteId((prev) => {
      if (prev && mazzo.some((c) => c.id === prev)) return prev
      return selezionaProssima(mazzo, stati, null)?.id ?? null
    })
    // Volutamente dipendente solo da `mazzo`: non vogliamo ripescare a ogni
    // aggiornamento di `stati` (che avviene a ogni risposta).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mazzo])

  const rispondi = useCallback(
    (esito: Esito) => {
      if (!corrente) return
      const now = Date.now()
      const attuale = stati[corrente.id] ?? statoIniziale()
      const aggiornato =
        esito === 'correct'
          ? rispostaCorretta(attuale, now)
          : rispostaSbagliata(attuale, now)
      const nuoviStati: StatiStudio = { ...stati, [corrente.id]: aggiornato }

      setStati(nuoviStati)
      setVistiSessione((n) => n + 1)
      if (esito === 'correct') setCorrettiSessione((n) => n + 1)
      else setSbagliatiSessione((n) => n + 1)

      // La prossima carta usa i pesi aggiornati ed esclude quella appena vista.
      const prossima = selezionaProssima(mazzo, nuoviStati, corrente.id)
      setCorrenteId(prossima?.id ?? null)
    },
    [corrente, stati, mazzo],
  )

  const salta = useCallback(() => {
    const prossima = selezionaProssima(mazzo, stati, corrente?.id ?? null)
    setCorrenteId(prossima?.id ?? null)
  }, [mazzo, stati, corrente])

  const reset = useCallback(() => {
    const freschi = inizializzaStati(cards, {})
    setStati(freschi)
    setVistiSessione(0)
    setCorrettiSessione(0)
    setSbagliatiSessione(0)
    setCorrenteId(selezionaProssima(mazzo, freschi, null)?.id ?? null)
  }, [cards, mazzo])

  return {
    corrente,
    boxCorrente: corrente ? stati[corrente.id]?.box ?? 1 : 1,
    filtro,
    setFiltro,
    rispondi,
    salta,
    reset,
    stats: {
      totale: mazzo.length,
      padroneggiate: padroneggiate(mazzo, stati),
      percentuale: percentualePadronanza(mazzo, stati),
      vistiSessione,
      correttiSessione,
      sbagliatiSessione,
    },
  }
}
