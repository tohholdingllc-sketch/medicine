import { useState } from 'react'
import { ChevronDown, Printer, Search, X } from 'lucide-react'
import type { Card, Gruppo } from '../types'

interface Props {
  cards: Card[]
  gruppi: Gruppo[]
}

/** Match su nome, titoli di sezione e punti: cerca ovunque nel contenuto. */
function corrisponde(card: Card, q: string): boolean {
  if (!q) return true
  const needle = q.toLowerCase()
  if (card.nome.toLowerCase().includes(needle)) return true
  return card.sezioni.some(
    (s) =>
      s.titolo.toLowerCase().includes(needle) ||
      s.punti.some((p) => p.toLowerCase().includes(needle)),
  )
}

/**
 * Modalità "Lezioni": indice a fisarmonica di tutto il materiale.
 * Voci chiuse di default (indice scansionabile); la ricerca apre i risultati
 * e la stampa espande tutto. Lo stato "aperte" (fuori ricerca) e "chiuse in
 * ricerca" sono separati per non sporcarsi a vicenda.
 */
export function Lezioni({ cards, gruppi }: Props) {
  const [q, setQ] = useState('')
  const [aperti, setAperti] = useState<Set<string>>(new Set())
  const [chiuseRicerca, setChiuseRicerca] = useState<Set<string>>(new Set())

  const cercando = q.trim() !== ''
  const filtrate = cards.filter((c) => corrisponde(c, q))

  const perGruppo = gruppi
    .map((g) => ({ gruppo: g, items: filtrate.filter((c) => c.gruppo === g.id) }))
    .filter((sez) => sez.items.length > 0)

  const isOpen = (id: string) => (cercando ? !chiuseRicerca.has(id) : aperti.has(id))

  const toggle = (id: string) => {
    if (cercando) {
      setChiuseRicerca((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    } else {
      setAperti((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }
  }

  const tuttiAperti = filtrate.length > 0 && filtrate.every((c) => aperti.has(c.id))
  const toggleTutti = () =>
    setAperti(tuttiAperti ? new Set() : new Set(filtrate.map((c) => c.id)))

  const aggiornaRicerca = (v: string) => {
    setQ(v)
    if (v.trim() === '') setChiuseRicerca(new Set())
  }

  return (
    <div className="lezioni">
      <p className="sr-only" role="status" aria-live="polite">
        {cercando ? `${filtrate.length} risultati per ${q}` : ''}
      </p>

      <div className="lezioni-toolbar">
        <div className="search">
          <Search size={16} aria-hidden="true" className="search-icon" />
          <input
            type="search"
            className="search-input"
            placeholder="Cerca batterio, sintomo, terapia…"
            value={q}
            onChange={(e) => aggiornaRicerca(e.target.value)}
            aria-label="Cerca nelle lezioni"
          />
          {q && (
            <button
              type="button"
              className="search-clear"
              onClick={() => aggiornaRicerca('')}
              aria-label="Cancella ricerca"
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>

        {!cercando && filtrate.length > 0 && (
          <button type="button" className="tool-btn" onClick={toggleTutti}>
            {tuttiAperti ? 'Comprimi tutti' : 'Espandi tutti'}
          </button>
        )}

        <button
          type="button"
          className="tool-btn"
          onClick={() => window.print()}
          aria-label="Stampa o salva in PDF"
        >
          <Printer size={16} aria-hidden="true" />
          <span>Stampa / PDF</span>
        </button>
      </div>

      {perGruppo.length === 0 ? (
        <p className="lezioni-empty">Nessun risultato per «{q}».</p>
      ) : (
        perGruppo.map(({ gruppo, items }) => (
          <section key={gruppo.id} className={`lezioni-gruppo accent-${gruppo.id}`}>
            <h2 className="lezioni-gruppo-titolo">
              <span className="tag-dot" aria-hidden="true" />
              {gruppo.nome}
              <span className="lezioni-count">{items.length}</span>
            </h2>

            {items.map((c) => {
              const open = isOpen(c.id)
              return (
                <article key={c.id} className={`lezione${open ? ' is-open' : ''}`}>
                  <h3 className="lezione-head-wrap">
                    <button
                      type="button"
                      id={`head-${c.id}`}
                      className="lezione-head"
                      aria-expanded={open}
                      aria-controls={`corpo-${c.id}`}
                      onClick={() => toggle(c.id)}
                    >
                      <ChevronDown size={18} className="lezione-chevron" aria-hidden="true" />
                      <span className="lezione-nome">{c.nome}</span>
                      <span className="lezione-nsez" aria-hidden="true">
                        {c.sezioni.length}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`corpo-${c.id}`}
                    className="lezione-body"
                    role="region"
                    aria-labelledby={`head-${c.id}`}
                  >
                    {c.sezioni.map((s, i) => (
                      <div key={i} className="lezione-sezione">
                        <h4 className="sezione-titolo">{s.titolo}</h4>
                        <ul className="punti">
                          {s.punti.map((p, j) => (
                            <li key={j} className="punto">
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>
              )
            })}
          </section>
        ))
      )}
    </div>
  )
}
