/**
 * Tailles proposées sur /sur-mesure selon la catégorie (style) choisie.
 */

export type SurMesureSizeOption = { value: string; label: string };

const braceletToursCm = [15, 16, 17, 18, 19, 20, 21, 22].map((n) => ({
  value: `bracelet-${n}cm`,
  label: `Bracelet / gourmette — ${n} cm`,
}));

const baguesTours = [48, 50, 52, 54, 56, 58, 60, 62].map((t) => ({
  value: `bague-tour-${t}`,
  label: `Bague — tour doigt ${t} (FR)`,
}));

const baguesUs = ['US 5', 'US 6', 'US 7', 'US 8', 'US 9'].map((u) => ({
  value: `bague-${u.replace(/\s/g, '')}`,
  label: `Bague — ${u}`,
}));

const sertie: SurMesureSizeOption[] = [
  { value: 'sertie-sur-devis', label: 'Sertie / sertla — taille sur devis avec l’artisan' },
];

const collierLongueurs = [40, 42, 45, 50, 55, 60].map((cm) => ({
  value: `collier-${cm}cm`,
  label: `Collier — ${cm} cm`,
}));

function sortEnsembleSizeList(list: SurMesureSizeOption[]): SurMesureSizeOption[] {
  const rank = (v: string) => {
    if (v.startsWith('bracelet')) return 1;
    if (v.startsWith('bague')) return 2;
    if (v.startsWith('sertie')) return 3;
    if (v.startsWith('collier')) return 4;
    return 5;
  };
  return [...list].sort((a, b) => {
    const ra = rank(a.value);
    const rb = rank(b.value);
    if (ra !== rb) return ra - rb;
    return a.label.localeCompare(b.label, 'fr');
  });
}

export const SUR_MESURE_SIZE_OPTIONS: Record<string, SurMesureSizeOption[]> = {
  beldi: [...braceletToursCm, ...baguesTours, ...sertie, ...collierLongueurs],
  modern: [...baguesUs, ...braceletToursCm, ...collierLongueurs, ...sertie],
  ensemble: sortEnsembleSizeList([
    ...braceletToursCm,
    ...baguesTours,
    ...sertie,
    ...collierLongueurs,
  ]),
  default: [
    { value: 'a-definir', label: 'À définir avec l’artisan (recommandé)' },
    ...braceletToursCm.slice(2, 8),
    ...baguesTours.slice(0, 6),
  ],
};

export function getSurMesureSizeOptionsForCategory(categorySlug: string): SurMesureSizeOption[] {
  const key = categorySlug?.toLowerCase().trim() || '';
  if (key === 'beldi') return SUR_MESURE_SIZE_OPTIONS.beldi;
  if (key === 'modern') return SUR_MESURE_SIZE_OPTIONS.modern;
  if (key === 'ensemble') return SUR_MESURE_SIZE_OPTIONS.ensemble;
  return SUR_MESURE_SIZE_OPTIONS.default;
}
