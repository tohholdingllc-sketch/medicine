// Morfologia dei batteri (materiale d'esame → mappata con cura, non inferita a runtime).
// Ogni id di carta è associato a una forma; le carte "concetto/patologia" usano
// la forma dell'agente eziologico.

export type Forma =
  | 'cocchi-grappolo'
  | 'cocchi-catena'
  | 'diplococchi'
  | 'bastoncello'
  | 'coccobacillo'
  | 'bastoncello-spora'
  | 'virgola'
  | 'spirillo'
  | 'spirocheta'
  | 'pleomorfo'
  | 'chlamydia'

export const ETICHETTE_FORMA: Record<Forma, string> = {
  'cocchi-grappolo': 'Cocchi a grappolo',
  'cocchi-catena': 'Cocchi a catena',
  diplococchi: 'Diplococchi',
  bastoncello: 'Bastoncello (bacillo)',
  coccobacillo: 'Coccobacillo',
  'bastoncello-spora': 'Bacillo sporigeno',
  virgola: 'Vibrione (a virgola)',
  spirillo: 'Ricurvo / spirillo',
  spirocheta: 'Spirocheta',
  pleomorfo: 'Pleomorfo (senza parete)',
  chlamydia: 'Corpi intracellulari',
}

const MAPPA: Record<string, Forma> = {
  staphylococcus: 'cocchi-grappolo',
  'staphylococcus-aureus': 'cocchi-grappolo',
  'staphylococcus-epidermidis': 'cocchi-grappolo',
  streptococcus: 'cocchi-catena',
  'streptococcus-pyogenes': 'cocchi-catena',
  'streptococcus-agalactiae': 'cocchi-catena',
  'streptococchi-orali': 'cocchi-catena',
  enterococchi: 'cocchi-catena',
  'streptococcus-pneumoniae': 'diplococchi',
  corynebacterium: 'bastoncello',
  'corynebacterium-diphtheriae': 'bastoncello',
  'corynebacterium-non-difterici': 'bastoncello',
  difterite: 'bastoncello',
  'listeria-monocytogenes': 'bastoncello',
  lactobacillus: 'bastoncello',
  bacillus: 'bastoncello-spora',
  'bacillus-anthracis': 'bastoncello-spora',
  'bacillus-cereus': 'bastoncello-spora',
  clostridium: 'bastoncello-spora',
  'clostridium-tetani': 'bastoncello-spora',
  'clostridium-botulinum': 'bastoncello-spora',
  'clostridium-difficile': 'bastoncello-spora',
  'clostridium-perfringens': 'bastoncello-spora',
  neisseria: 'diplococchi',
  'neisseria-gonorrhoeae': 'diplococchi',
  'neisseria-meningitidis': 'diplococchi',
  'pseudomonas-aeruginosa': 'bastoncello',
  mycobacterium: 'bastoncello',
  'mycobacterium-tuberculosis': 'bastoncello',
  'mycobacterium-leprae': 'bastoncello',
  haemophilus: 'coccobacillo',
  'haemophilus-influenzae': 'coccobacillo',
  'haemophilus-parainfluenzae': 'coccobacillo',
  'haemophilus-ducreyi': 'coccobacillo',
  legionella: 'bastoncello',
  'escherichia-coli': 'bastoncello',
  klebsiella: 'bastoncello',
  proteus: 'bastoncello',
  salmonella: 'bastoncello',
  shigella: 'bastoncello',
  'yersinia-pestis': 'coccobacillo',
  'vibrio-cholerae': 'virgola',
  'campylobacter-jejuni': 'spirillo',
  'helicobacter-pylori': 'spirillo',
  brucella: 'coccobacillo',
  'bordetella-pertussis': 'coccobacillo',
  'chlamydophila-pneumoniae': 'chlamydia',
  'chlamydophila-psittaci': 'chlamydia',
  'chlamydia-trachomatis': 'chlamydia',
  'mycoplasma-pneumoniae': 'pleomorfo',
  'ureaplasma-urealyticum': 'pleomorfo',
  'mycoplasma-genitalium': 'pleomorfo',
  'mycoplasma-hominis': 'pleomorfo',
  'treponema-pallidum': 'spirocheta',
  borrelia: 'spirocheta',
  'leptospira-interrogans': 'spirocheta',
}

export function formaDi(id: string): Forma {
  return MAPPA[id] ?? 'bastoncello'
}

export function etichettaMorfologia(id: string): string {
  return ETICHETTE_FORMA[formaDi(id)]
}
