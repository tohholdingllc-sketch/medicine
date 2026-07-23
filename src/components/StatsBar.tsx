interface Stats {
  totale: number
  padroneggiate: number
  percentuale: number
  vistiSessione: number
  correttiSessione: number
  sbagliatiSessione: number
}

interface Props {
  stats: Stats
  mazzoNome: string
}

/** Header con statistiche live e barra di padronanza. */
export function StatsBar({ stats, mazzoNome }: Props) {
  return (
    <section className="statsbar" aria-label="Statistiche di studio">
      <div className="statsbar-top">
        <div className="stat">
          <span className="stat-label">Mazzo attivo</span>
          <span className="stat-value">{mazzoNome}</span>
        </div>
        <div className="stat stat--right">
          <span className="stat-label">Padronanza</span>
          <span className="stat-value stat-value--accent">{stats.percentuale}%</span>
        </div>
      </div>

      <div
        className="mastery-track"
        role="progressbar"
        aria-valuenow={stats.percentuale}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Padronanza del mazzo"
      >
        <div className="mastery-fill" style={{ width: `${stats.percentuale}%` }} />
      </div>

      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">Padroneggiate</span>
          <span className="stat-value">
            {stats.padroneggiate} / {stats.totale}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Viste (sessione)</span>
          <span className="stat-value">{stats.vistiSessione}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Sapute</span>
          <span className="stat-value stat-value--ok">{stats.correttiSessione}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Da rivedere</span>
          <span className="stat-value stat-value--no">{stats.sbagliatiSessione}</span>
        </div>
      </div>
    </section>
  )
}
