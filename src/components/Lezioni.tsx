import type { Card, Gruppo } from '../types'

interface Props {
  cards: Card[]
  gruppi: Gruppo[]
}

/**
 * Modalità "Lezioni": tutto il contenuto in un unico documento da leggere di
 * seguito. Ogni batterio = titolo + le sue sezioni (titolo + spiegazioni).
 * Raggruppato per categoria di Gram, rispetta il filtro attivo.
 */
export function Lezioni({ cards, gruppi }: Props) {
  const perGruppo = gruppi
    .map((g) => ({ gruppo: g, items: cards.filter((c) => c.gruppo === g.id) }))
    .filter((sez) => sez.items.length > 0)

  return (
    <div className="lezioni">
      {perGruppo.map(({ gruppo, items }) => (
        <section key={gruppo.id} className={`lezioni-gruppo accent-${gruppo.id}`}>
          <h2 className="lezioni-gruppo-titolo">
            <span className="tag-dot" aria-hidden="true" />
            {gruppo.nome}
            <span className="lezioni-count">{items.length}</span>
          </h2>

          {items.map((c) => (
            <article key={c.id} className="lezione">
              <h3 className="lezione-nome">{c.nome}</h3>
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
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}
