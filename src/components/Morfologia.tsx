import type { Forma } from '../lib/morfologia'

interface Props {
  forma: Forma
  className?: string
}

/** Glifo schematico della morfologia. Usa currentColor (prende l'accento del gruppo). */
export function Morfologia({ forma, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 24"
      width="46"
      height="23"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glifo(forma)}
    </svg>
  )
}

function glifo(forma: Forma) {
  const pieni = { fill: 'currentColor', stroke: 'none' } as const
  switch (forma) {
    case 'cocchi-grappolo':
      return (
        <g {...pieni}>
          <circle cx="18" cy="9" r="4.2" />
          <circle cx="27" cy="8" r="4.2" />
          <circle cx="14" cy="15" r="4.2" />
          <circle cx="23" cy="16" r="4.2" />
          <circle cx="31" cy="15" r="4.2" />
        </g>
      )
    case 'cocchi-catena':
      return (
        <g {...pieni}>
          <circle cx="8" cy="12" r="3.9" />
          <circle cx="17" cy="12" r="3.9" />
          <circle cx="26" cy="12" r="3.9" />
          <circle cx="35" cy="12" r="3.9" />
          <circle cx="44" cy="12" r="3.9" />
        </g>
      )
    case 'diplococchi':
      return (
        <g {...pieni}>
          <circle cx="18" cy="12" r="6" />
          <circle cx="30" cy="12" r="6" />
        </g>
      )
    case 'bastoncello':
      return <rect x="7" y="7" width="34" height="10" rx="5" />
    case 'coccobacillo':
      return <ellipse cx="24" cy="12" rx="12" ry="7" />
    case 'bastoncello-spora':
      return (
        <>
          <rect x="6" y="8" width="26" height="8" rx="4" />
          <circle cx="34" cy="12" r="5.5" />
        </>
      )
    case 'virgola':
      return <path d="M13 7 C28 3 34 12 29 19" strokeWidth={3} />
    case 'spirillo':
      return <path d="M7 16 C13 4 19 4 24 12 C29 20 35 20 41 8" strokeWidth={2.4} />
    case 'spirocheta':
      return (
        <path d="M4 12 C7 4 11 4 14 12 C17 20 21 20 24 12 C27 4 31 4 34 12 C37 20 41 20 44 12" strokeWidth={2.2} />
      )
    case 'pleomorfo':
      return <path d="M15 7 C9 8 8 15 13 18 C19 21 27 20 32 17 C38 13 36 7 30 6 C24 5 20 6 15 7 Z" />
    case 'chlamydia':
      return (
        <>
          <circle cx="24" cy="12" r="9" />
          <circle cx="24" cy="12" r="3.4" fill="currentColor" stroke="none" />
        </>
      )
  }
}
