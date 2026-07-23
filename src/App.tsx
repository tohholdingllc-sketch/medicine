import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUp, BookOpen, Check, FlaskConical, Layers, Moon, RotateCcw, Sun, X } from 'lucide-react'
import rawData from './data/flashcards-data.json'
import type { Dataset, Gruppo, GruppoId } from './types'
import { useTheme } from './hooks/useTheme'
import { useSpacedRepetition, type Esito } from './hooks/useSpacedRepetition'
import { Card } from './components/Card'
import { Controls } from './components/Controls'
import { StatsBar } from './components/StatsBar'
import { FilterBar } from './components/FilterBar'
import { ShortcutsHint } from './components/ShortcutsHint'
import { Lezioni } from './components/Lezioni'

const dataset = rawData as unknown as Dataset

const GRUPPI_BY_ID = Object.fromEntries(
  dataset.gruppi.map((g) => [g.id, g]),
) as Record<GruppoId, Gruppo>

/** Durata del feedback verde/rosso prima di passare alla carta successiva. */
const FEEDBACK_MS = 430

export default function App() {
  const { theme, toggle } = useTheme()
  const { corrente, boxCorrente, filtro, setFiltro, rispondi, salta, reset, stats } =
    useSpacedRepetition(dataset.cards)

  const [flipped, setFlipped] = useState(false)
  const [feedback, setFeedback] = useState<Esito | null>(null)
  const [liveMsg, setLiveMsg] = useState('')
  const [modalita, setModalita] = useState<'ripasso' | 'lezioni'>('ripasso')

  const answering = useRef(false)
  const timerRef = useRef<number | null>(null)
  const focusNext = useRef(false)
  const lastEsito = useRef<Esito | null>(null)
  const flipBtnRef = useRef<HTMLButtonElement>(null)

  /** Annulla un eventuale timer di feedback pendente e sblocca l'input. */
  const cancellaTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    answering.current = false
  }, [])

  // A ogni nuova carta: fronte, annuncio per screen reader, ed eventuale focus da tastiera.
  useEffect(() => {
    setFlipped(false)
    if (!corrente) return
    const esito = lastEsito.current
    lastEsito.current = null
    const prefisso = esito === 'correct' ? 'Corretto. ' : esito === 'wrong' ? 'Da rivedere. ' : ''
    setLiveMsg(`${prefisso}${corrente.nome}, ${GRUPPI_BY_ID[corrente.gruppo]?.nome ?? ''}`)
    if (focusNext.current) {
      focusNext.current = false
      flipBtnRef.current?.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corrente?.id])

  // Cambio filtro durante il feedback: annulla il timer pendente (evita race/stale closure).
  useEffect(() => {
    cancellaTimer()
    setFeedback(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro])

  // Pulizia del timer allo smontaggio.
  useEffect(() => cancellaTimer, [cancellaTimer])

  const handleFlip = useCallback(() => {
    if (answering.current) return
    setFlipped((f) => !f)
  }, [])

  const handleAnswer = useCallback(
    (esito: Esito) => {
      if (!flipped || answering.current || !corrente) return
      answering.current = true
      setFeedback(esito)
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        lastEsito.current = esito
        focusNext.current = true
        setFlipped(false)
        rispondi(esito)
        setFeedback(null)
        answering.current = false
      }, FEEDBACK_MS)
    },
    [flipped, corrente, rispondi],
  )

  const handleSkip = useCallback(() => {
    if (answering.current) return
    focusNext.current = true
    setFlipped(false)
    salta()
  }, [salta])

  const handleReset = useCallback(() => {
    const ok = window.confirm(
      'Azzerare tutti i progressi? Tutte le carte torneranno al livello iniziale e i contatori verranno resettati.',
    )
    if (!ok) return
    cancellaTimer()
    setFeedback(null)
    setFlipped(false)
    reset()
  }, [reset, cancellaTimer])

  // Scorciatoie da tastiera.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      if (modalita !== 'ripasso') return // in Lezioni la tastiera resta libera (scroll)
      const target = e.target as HTMLElement | null
      const suControllo = !!target?.closest('button, a, input, select, textarea')
      switch (e.key) {
        case ' ':
        case 'Enter':
          // Se il focus è su un controllo, lascia agire quello (non rubare il tasto).
          if (suControllo) return
          e.preventDefault()
          handleFlip()
          break
        case '1':
        case 'ArrowLeft':
          if (flipped) {
            e.preventDefault()
            handleAnswer('wrong')
          }
          break
        case '2':
        case 'ArrowRight':
          if (flipped) {
            e.preventDefault()
            handleAnswer('correct')
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          handleSkip()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped, modalita, handleFlip, handleAnswer, handleSkip])

  const gruppoNome = corrente ? GRUPPI_BY_ID[corrente.gruppo]?.nome ?? '' : ''
  const mazzoNome = filtro === 'tutti' ? 'Tutti' : GRUPPI_BY_ID[filtro]?.nome ?? 'Tutti'
  const accent = corrente?.gruppo ?? 'gram-pos'
  const cardsFiltrate =
    filtro === 'tutti' ? dataset.cards : dataset.cards.filter((c) => c.gruppo === filtro)

  return (
    <div className={`app accent-${accent}`}>
      <p className="sr-only" role="status" aria-live="polite">
        {liveMsg}
      </p>

      <div className="shell">
        <header className="header rise" style={{ animationDelay: '0ms' }}>
          <div className="brand">
            <span className="brand-mark">
              <FlaskConical size={20} aria-hidden="true" />
            </span>
            <div className="brand-text">
              <h1 className="brand-title">Batteriologia</h1>
              <p className="brand-sub">Flashcards · {dataset.cards.length} schede</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
              title={theme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={handleReset}
              aria-label="Reset progressi"
              title="Reset progressi"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </header>

        <div
          className="modeswitch rise"
          role="group"
          aria-label="Modalità di studio"
          style={{ animationDelay: '60ms' }}
        >
          <button
            type="button"
            className={modalita === 'ripasso' ? 'is-active' : ''}
            aria-pressed={modalita === 'ripasso'}
            onClick={() => setModalita('ripasso')}
          >
            <Layers size={16} aria-hidden="true" /> Ripasso
          </button>
          <button
            type="button"
            className={modalita === 'lezioni' ? 'is-active' : ''}
            aria-pressed={modalita === 'lezioni'}
            onClick={() => setModalita('lezioni')}
          >
            <BookOpen size={16} aria-hidden="true" /> Lezioni
          </button>
        </div>

        <div className="rise" style={{ animationDelay: '120ms' }}>
          <FilterBar gruppi={dataset.gruppi} filtro={filtro} onChange={setFiltro} />
        </div>

        {modalita === 'ripasso' ? (
          <>
            <div className="rise" style={{ animationDelay: '170ms' }}>
              <StatsBar stats={stats} mazzoNome={mazzoNome} />
            </div>

            <main className="stage rise" style={{ animationDelay: '220ms' }}>
              <div className="stage-top">
                <button
                  type="button"
                  className="skip-btn"
                  onClick={handleSkip}
                  aria-label="Salta alla prossima carta (freccia su)"
                >
                  Salta
                  <ArrowUp size={15} aria-hidden="true" />
                </button>
              </div>

              {corrente ? (
                <div className="card-wrap" key={corrente.id}>
                  <div className="card-enter">
                    <Card
                      card={corrente}
                      gruppoNome={gruppoNome}
                      box={boxCorrente}
                      flipped={flipped}
                      onFlip={handleFlip}
                      flipRef={flipBtnRef}
                    />
                    {feedback && (
                      <div
                        className={`feedback feedback--${feedback === 'correct' ? 'ok' : 'no'}`}
                        aria-hidden="true"
                      >
                        <span className="feedback-badge">
                          {feedback === 'correct' ? <Check size={34} /> : <X size={34} />}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="empty">Nessuna carta nel mazzo selezionato.</div>
              )}

              <Controls
                flipped={flipped}
                onWrong={() => handleAnswer('wrong')}
                onCorrect={() => handleAnswer('correct')}
              />

              <p className={`hint-flip${flipped ? ' is-hidden' : ''}`}>
                Gira la carta per abilitare le risposte
              </p>
            </main>
          </>
        ) : (
          <div className="rise" style={{ animationDelay: '170ms' }}>
            <Lezioni cards={cardsFiltrate} gruppi={dataset.gruppi} />
          </div>
        )}

        <footer className="footer">
          <ShortcutsHint />
          <p className="fonte">Fonte: {dataset.meta.fonte}</p>
        </footer>
      </div>
    </div>
  )
}
