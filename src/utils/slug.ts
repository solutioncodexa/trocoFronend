/**
 * Slugs et noms multi-langues (français / arabe / darija en lettres latines).
 * Un nom arabe (« قفاطين ») ne doit pas donner un slug vide : on le translittère (« qftan »…).
 */

const AR_MAP: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a', 'ٱ': 'a', 'ء': '', 'ؤ': 'o', 'ئ': 'i', 'ى': 'a', 'ة': 'a',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'ch', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'o', 'ي': 'i', 'گ': 'g', 'پ': 'p', 'چ': 'tch', 'ڤ': 'v',
  // chiffres arabes-indiens
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
};

/** Remplace les lettres arabes par leur équivalent latin (diacritiques et tatweel supprimés). */
export function transliterateArabic(input: string): string {
  return Array.from(input.replace(/[ً-ٰٟـ]/g, ''))
    .map((ch) => AR_MAP[ch] ?? ch)
    .join('');
}

/** `Caftans & Takchitas` → `caftans-takchitas` ; `قفاطين` → `qftain`. Jamais de slug vide si le nom contient des lettres. */
export function slugify(name: string): string {
  return transliterateArabic(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Clé de comparaison tolérante (casse, accents, diacritiques arabes, espaces). */
export function nameKey(name: string): string {
  return transliterateArabic(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

/**
 * Découpe une saisie multiple : retours à la ligne, virgule, point-virgule, barre verticale, ainsi que
 * la virgule arabe « ، » et le point-virgule arabe « ؛ ». Supprime les doublons (sans tenir compte de la casse/accents).
 */
export function splitNames(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[\n\r,;|،؛]+/)) {
    const name = part.trim().replace(/\s+/g, ' ');
    if (!name) continue;
    const key = nameKey(name) || name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}
