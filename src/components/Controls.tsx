import { Check, X } from 'lucide-react'

interface Props {
  flipped: boolean
  onWrong: () => void
  onCorrect: () => void
}

/** I due pulsanti di giudizio, attivi solo dopo il flip. */
export function Controls({ flipped, onWrong, onCorrect }: Props) {
  return (
    <div className="controls">
      <button
        type="button"
        className="answer-btn answer-btn--no"
        onClick={onWrong}
        disabled={!flipped}
        aria-label="Da rivedere, risposta sbagliata (tasto 1 o freccia sinistra)"
      >
        <X size={19} aria-hidden="true" />
        <span>Da rivedere</span>
        <kbd className="kbd" aria-hidden="true">1</kbd>
      </button>

      <button
        type="button"
        className="answer-btn answer-btn--ok"
        onClick={onCorrect}
        disabled={!flipped}
        aria-label="Lo sapevo, risposta corretta (tasto 2 o freccia destra)"
      >
        <Check size={19} aria-hidden="true" />
        <span>Lo sapevo</span>
        <kbd className="kbd" aria-hidden="true">2</kbd>
      </button>
    </div>
  )
}
