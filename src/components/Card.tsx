import type { Ref } from 'react'
import { RefreshCw } from 'lucide-react'
import type { Card as CardType } from '../types'

interface Props {
  card: CardType
  gruppoNome: string
  /** Box corrente (1..5) per l'indicatore di livello sul fronte. */
  box: number
  flipped: boolean
  onFlip: () => void
  /**
   * Ref al contenitore 3D (div, non un pulsante): dopo l'avanzamento vi si
   * riporta il focus per continuità da tastiera, SENZA che le scorciatoie
   * globali vengano bloccate dalla guardia "focus su un controllo".
   */
  cardRef?: Ref<HTMLDivElement>
}

/**
 * Flashcard con flip 3D reale.
 * Fronte = nome del batterio; retro = sezioni scrollabili.
 * La faccia non visibile è `aria-hidden` e i suoi controlli hanno tabIndex -1.
 */
export function Card({ card, gruppoNome, box, flipped, onFlip, cardRef }: Props) {
  return (
    <div className={`card-scene accent-${card.gruppo}`}>
      <div
        ref={cardRef}
        tabIndex={-1}
        className={`card-3d${flipped ? ' is-flipped' : ''}`}
      >
        {/* ---------- FRONTE ---------- */}
        <div className="card-face card-face--front" onClick={onFlip} aria-hidden={flipped}>
          <div className="card-front-inner">
            <span className="tag">
              <span className="tag-dot" />
              {gruppoNome}
            </span>

            <h2 className="bacterium-name">{card.nome}</h2>

            <div className="level" aria-hidden="true">
              <span className="level-label">livello</span>
              <span className="level-pips">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`pip${i < box ? ' pip--on' : ''}`} />
                ))}
              </span>
            </div>

            <button
              type="button"
              className="flip-btn"
              tabIndex={flipped ? -1 : 0}
              onClick={(e) => {
                e.stopPropagation()
                onFlip()
              }}
              aria-label={`Gira la carta per vedere la risposta su ${card.nome}`}
            >
              <RefreshCw size={13} aria-hidden="true" /> tocca per girare
            </button>
          </div>
        </div>

        {/* ---------- RETRO ---------- */}
        <div className="card-face card-face--back" aria-hidden={!flipped}>
          <div className="card-back-inner">
            <div className="card-back-head">
              <div className="card-back-titles">
                <h3 className="card-back-name">{card.nome}</h3>
                <span className="tag tag--sm">{gruppoNome}</span>
              </div>
              <button
                type="button"
                className="flip-btn-back"
                tabIndex={flipped ? 0 : -1}
                onClick={onFlip}
                aria-label="Torna al fronte della carta"
              >
                <RefreshCw size={15} aria-hidden="true" />
              </button>
            </div>
            <div className="card-back-scroll">
              {card.sezioni.map((s, i) => (
                <section key={i} className="sezione">
                  <h4 className="sezione-titolo">{s.titolo}</h4>
                  <ul className="punti">
                    {s.punti.map((p, j) => (
                      <li key={j} className="punto">
                        {p}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
