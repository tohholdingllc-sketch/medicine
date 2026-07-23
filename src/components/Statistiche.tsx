import type { Card, Gruppo, StatiStudio } from '../types'
import { BOX_MAX } from '../lib/spacedRepetition'

interface Props {
  cards: Card[]
  gruppi: Gruppo[]
  stati: StatiStudio
  sessione: { viste: number; sapute: number; sbagliate: number }
}

/**
 * Modalità "Progressi": statistiche calcolate dallo stato salvato (box per carta,
 * corrette/sbagliate, viste) — padronanza totale e per gruppo, distribuzione per
 * livello (curva di apprendimento), accuratezza e riepilogo di sessione.
 */
export function Statistiche({ cards, gruppi, stati, sessione }: Props) {
  const box = (id: string) => stati[id]?.box ?? 1

  const perGruppo = gruppi.map((g) => {
    const items = cards.filter((c) => c.gruppo === g.id)
    const padr = items.filter((c) => box(c.id) === BOX_MAX).length
    return {
      g,
      tot: items.length,
      padr,
      perc: items.length ? Math.round((padr / items.length) * 100) : 0,
    }
  })

  const distribuzione = [1, 2, 3, 4, 5].map((b) => ({
    box: b,
    n: cards.filter((c) => box(c.id) === b).length,
  }))
  const maxN = Math.max(1, ...distribuzione.map((d) => d.n))

  let corrette = 0
  let sbagliate = 0
  let studiate = 0
  for (const c of cards) {
    const s = stati[c.id]
    if (!s) continue
    corrette += s.corrette
    sbagliate += s.sbagliate
    if (s.vistaCount > 0) studiate++
  }
  const risposte = corrette + sbagliate
  const accuratezza = risposte ? Math.round((corrette / risposte) * 100) : 0
  const padrTot = cards.filter((c) => box(c.id) === BOX_MAX).length
  const percTot = cards.length ? Math.round((padrTot / cards.length) * 100) : 0

  return (
    <div className="progressi">
      <section className="prog-card">
        <div className="prog-head">
          <span className="prog-label">Padronanza totale</span>
          <span className="prog-big">{percTot}%</span>
        </div>
        <div className="mastery-track">
          <div className="mastery-fill" style={{ width: `${percTot}%` }} />
        </div>
        <p className="prog-sub">
          {padrTot} / {cards.length} carte padroneggiate · {studiate} studiate almeno una volta
        </p>
      </section>

      <section className="prog-card">
        <span className="prog-label">Padronanza per gruppo</span>
        <div className="prog-gruppi">
          {perGruppo.map(({ g, tot, padr, perc }) => (
            <div key={g.id} className={`prog-gruppo accent-${g.id}`}>
              <div className="prog-gruppo-top">
                <span className="prog-gruppo-nome">
                  <span className="tag-dot" aria-hidden="true" />
                  {g.nome}
                </span>
                <span className="prog-gruppo-val">
                  {padr}/{tot} · {perc}%
                </span>
              </div>
              <div className="mastery-track">
                <div className="prog-gruppo-fill" style={{ width: `${perc}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="prog-card">
        <span className="prog-label">Distribuzione per livello</span>
        <p className="prog-hint">Le carte salgono dal livello 1 (da imparare) al 5 (padroneggiata).</p>
        <div className="prog-distr">
          {distribuzione.map(({ box: b, n }) => (
            <div key={b} className="prog-distr-row">
              <span className="prog-distr-lab">Liv. {b}</span>
              <div className="prog-distr-track">
                <div
                  className="prog-distr-fill"
                  style={{
                    width: `${Math.round((n / maxN) * 100)}%`,
                    background: `color-mix(in srgb, var(--ok) ${((b - 1) / 4) * 100}%, var(--err))`,
                  }}
                />
              </div>
              <span className="prog-distr-n">{n}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="prog-card">
        <span className="prog-label">Accuratezza</span>
        <div className="prog-acc">
          <span className="prog-big">{accuratezza}%</span>
          <span className="prog-acc-det">
            <span className="stat-value--ok">{corrette}</span> giuste ·{' '}
            <span className="stat-value--no">{sbagliate}</span> sbagliate
          </span>
        </div>
        <div className="prog-mini">
          <div>
            <span className="prog-mini-lab">Risposte totali</span>
            <span className="prog-mini-val">{risposte}</span>
          </div>
          <div>
            <span className="prog-mini-lab">Viste (sessione)</span>
            <span className="prog-mini-val">{sessione.viste}</span>
          </div>
          <div>
            <span className="prog-mini-lab">Sessione ✓ / ✗</span>
            <span className="prog-mini-val">
              <span className="stat-value--ok">{sessione.sapute}</span> /{' '}
              <span className="stat-value--no">{sessione.sbagliate}</span>
            </span>
          </div>
        </div>
      </section>

      {risposte === 0 && (
        <p className="lezioni-empty">Rispondi a qualche carta in «Ripasso» per popolare i progressi.</p>
      )}
    </div>
  )
}
