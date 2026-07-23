/** Mini-legenda delle scorciatoie da tastiera (solo desktop). */
export function ShortcutsHint() {
  return (
    <div className="shortcuts" aria-hidden="true">
      <span className="shortcut">
        <kbd className="kbd">Spazio</kbd> gira
      </span>
      <span className="shortcut">
        <kbd className="kbd">1</kbd>
        <kbd className="kbd">←</kbd> da rivedere
      </span>
      <span className="shortcut">
        <kbd className="kbd">2</kbd>
        <kbd className="kbd">→</kbd> lo sapevo
      </span>
      <span className="shortcut">
        <kbd className="kbd">↑</kbd> salta
      </span>
    </div>
  )
}
