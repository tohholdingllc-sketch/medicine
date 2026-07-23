import { describe, it, expect } from 'vitest'
import type { Card, StatiStudio } from '../types'
import {
  BOX_MAX,
  BOX_MIN,
  PESI,
  statoIniziale,
  inizializzaStati,
  rispostaCorretta,
  rispostaSbagliata,
  peso,
  selezionaProssima,
  padroneggiate,
  percentualePadronanza,
} from './spacedRepetition'

const carte = (ids: string[]): Card[] =>
  ids.map((id) => ({ id, nome: id, gruppo: 'gram-pos', sezioni: [] }))

describe('statoIniziale', () => {
  it('parte da box 1 con contatori a zero', () => {
    expect(statoIniziale()).toEqual({
      box: 1,
      corrette: 0,
      sbagliate: 0,
      vistaCount: 0,
      ultimaVista: null,
    })
  })
})

describe('rispostaCorretta / rispostaSbagliata', () => {
  it('corretta: +1 box, conta e registra il timestamp', () => {
    const s = rispostaCorretta(statoIniziale(), 1000)
    expect(s.box).toBe(2)
    expect(s.corrette).toBe(1)
    expect(s.vistaCount).toBe(1)
    expect(s.ultimaVista).toBe(1000)
  })

  it('corretta: non supera BOX_MAX', () => {
    const s = rispostaCorretta({ ...statoIniziale(), box: BOX_MAX }, 1)
    expect(s.box).toBe(BOX_MAX)
  })

  it('sbagliata: torna a box 1 e incrementa gli errori', () => {
    const s = rispostaSbagliata({ ...statoIniziale(), box: 4 }, 2000)
    expect(s.box).toBe(BOX_MIN)
    expect(s.sbagliate).toBe(1)
  })
})

describe('peso', () => {
  it('box basso pesa piu di box alto', () => {
    expect(peso(1)).toBe(PESI[1])
    expect(peso(1)).toBeGreaterThan(peso(5))
  })
})

describe('selezionaProssima', () => {
  it('non ripesca mai la carta appena vista (mazzo > 1)', () => {
    const mazzo = carte(['a', 'b', 'c'])
    const stati = inizializzaStati(mazzo)
    for (let r = 0; r < 1; r += 0.02) {
      expect(selezionaProssima(mazzo, stati, 'a', () => r)?.id).not.toBe('a')
    }
  })

  it('con una sola carta restituisce quella (anche se e la stessa appena vista)', () => {
    const uno = carte(['solo'])
    expect(selezionaProssima(uno, inizializzaStati(uno), 'solo')?.id).toBe('solo')
  })

  it('rispetta i pesi: il box basso viene estratto piu spesso', () => {
    const mazzo = carte(['x', 'y'])
    const stati: StatiStudio = {
      x: { ...statoIniziale(), box: 1 }, // peso 32
      y: { ...statoIniziale(), box: 5 }, // peso 2
    }
    // totale = 34; rnd*34 < 32 -> x, altrimenti y
    expect(selezionaProssima(mazzo, stati, null, () => 0)?.id).toBe('x')
    expect(selezionaProssima(mazzo, stati, null, () => 0.99)?.id).toBe('y')
  })

  it('mazzo vuoto -> null', () => {
    expect(selezionaProssima([], {}, null)).toBeNull()
  })
})

describe('padronanza', () => {
  it('conta le carte in box 5 e ne calcola la percentuale', () => {
    const mazzo = carte(['a', 'b', 'c', 'd'])
    const stati = inizializzaStati(mazzo)
    stati.a.box = BOX_MAX
    stati.b.box = BOX_MAX
    expect(padroneggiate(mazzo, stati)).toBe(2)
    expect(percentualePadronanza(mazzo, stati)).toBe(50)
  })
})

describe('inizializzaStati (robustezza persistenza)', () => {
  it('scarta stati salvati malformati e riparte da statoIniziale', () => {
    const mazzo = carte(['a'])
    // box fuori range -> non valido
    const stati = inizializzaStati(mazzo, { a: { box: 99 } as unknown as never })
    expect(stati.a.box).toBe(BOX_MIN)
  })

  it('mantiene gli stati salvati validi', () => {
    const mazzo = carte(['a'])
    const salvato: StatiStudio = {
      a: { box: 3, corrette: 2, sbagliate: 1, vistaCount: 3, ultimaVista: 5 },
    }
    expect(inizializzaStati(mazzo, salvato).a.box).toBe(3)
  })

  it('aggiunge stato fresco per carte nuove non presenti nel salvataggio', () => {
    const mazzo = carte(['a', 'b'])
    const salvato: StatiStudio = {
      a: { box: 4, corrette: 0, sbagliate: 0, vistaCount: 0, ultimaVista: null },
    }
    const stati = inizializzaStati(mazzo, salvato)
    expect(stati.a.box).toBe(4)
    expect(stati.b.box).toBe(BOX_MIN)
  })
})
