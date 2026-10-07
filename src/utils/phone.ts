/**
 * Téléphones marocains : même forme canonique que le backend (`PhoneUtil`).
 * « 06 12 34 56 78 », « 0612345678 », « +212 6 12 34 56 78 », « 00212612345678 » → `+212612345678`.
 */
const isMaNational = (d: string) => d.length === 9 && /^[5-8]/.test(d);

/** Forme canonique (E.164 pour le Maroc), chiffres seuls pour un numéro non reconnu. `null` si vide. */
export function normalizePhone(raw?: string | null): string | null {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return null;
  let plus = trimmed.startsWith('+');
  let digits = trimmed.replace(/\D/g, '');
  if (!digits) return null;
  if (!plus && digits.startsWith('00')) {
    digits = digits.slice(2);
    plus = true;
  }
  if (plus) {
    if (digits.startsWith('2120') && isMaNational(digits.slice(4))) return `+212${digits.slice(4)}`;
    return `+${digits}`;
  }
  if (digits.length === 10 && digits.startsWith('0') && isMaNational(digits.slice(1))) return `+212${digits.slice(1)}`;
  if (isMaNational(digits)) return `+212${digits}`;
  if (digits.startsWith('212') && isMaNational(digits.slice(3))) return `+${digits}`;
  return digits;
}

/** Numéro utilisable : marocain valide, ou international plausible (8 à 15 chiffres). */
export function isValidPhone(raw?: string | null): boolean {
  const p = normalizePhone(raw);
  if (!p) return false;
  if (p.startsWith('+212')) return isMaNational(p.slice(4));
  // Écriture nationale (0X XX XX XX XX) mais préfixe inexistant au Maroc → refusé.
  if (!p.startsWith('+') && p.length === 10 && p.startsWith('0')) return false;
  return p.replace(/\D/g, '').length >= 8 && p.replace(/\D/g, '').length <= 15;
}

/** Affichage lisible : +212 6 12 34 56 78 */
export function formatPhone(raw?: string | null): string {
  const p = normalizePhone(raw);
  if (!p) return raw ?? '';
  const m = /^\+212(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(p);
  return m ? `+212 ${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]}` : p;
}

/** Format wa.me : chiffres internationaux sans « + » (`null` si inutilisable). */
export function whatsappDigits(raw?: string | null): string | null {
  const p = normalizePhone(raw);
  if (!p) return null;
  const digits = p.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}
