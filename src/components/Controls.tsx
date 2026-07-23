import { Check, RefreshCw, X } from 'lucide-react'

interface Props {
  flipped: boolean
  onFlip: () => void
  onWrong: () => void
  onCorrect: () => void
}

/**
 * Prima del flip mostra un unico CTA "Gira la carta" (utile sulla barra fissa
 * mobile, dove non ha senso tenere due pulsanti disabilitati). Dopo il flip,
 * i due giudizi ✗ / ✓.
 */
export function Controls({ flipped, onFlip, onWrong, onCorrect }: Props) {
  if (!flipped) {
    return (
      <div className="controls controls--single">
        <button type="button" className="answer-btn answer-btn--flip" onClick={onFlip}>
          <RefreshCw size={18} aria-hidden="true" />
          <span>Gira la carta</span>
        </button>
      </div>
    )
  }

  return (
    <div className="controls">
      <button
        type="button"
        className="answer-btn answer-btn--no"
        onClick={onWrong}
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
        aria-label="Lo sapevo, risposta corretta (tasto 2 o freccia destra)"
      >
        <Check size={19} aria-hidden="true" />
        <span>Lo sapevo</span>
        <kbd className="kbd" aria-hidden="true">2</kbd>
      </button>
    </div>
  )
}
