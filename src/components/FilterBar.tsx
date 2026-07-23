import type { CSSProperties } from 'react'
import type { Filtro, Gruppo } from '../types'

interface Props {
  gruppi: Gruppo[]
  filtro: Filtro
  onChange: (f: Filtro) => void
}

interface Opzione {
  id: Filtro
  label: string
  colore?: string
}

/**
 * Barra dei filtri per gruppo. Cambia il mazzo attivo del ripescaggio.
 * È un gruppo di toggle (role="group" + aria-pressed), non tab ARIA.
 */
export function FilterBar({ gruppi, filtro, onChange }: Props) {
  const opzioni: Opzione[] = [
    { id: 'tutti', label: 'Tutti' },
    ...gruppi.map((g): Opzione => ({ id: g.id, label: g.nome, colore: g.colore })),
  ]

  return (
    <div className="filterbar" role="group" aria-label="Filtra per gruppo">
      {opzioni.map((o) => {
        const active = filtro === o.id
        const style = o.colore
          ? ({
              '--pill-accent': `var(--${o.colore})`,
              '--pill-bg': `var(--${o.colore}-bg)`,
            } as CSSProperties)
          : undefined
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            className={`filter-pill${active ? ' is-active' : ''}`}
            style={style}
            onClick={() => onChange(o.id)}
          >
            {o.colore && <span className="pill-dot" aria-hidden="true" />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
