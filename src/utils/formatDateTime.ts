/**
 * Affiche une date/heure API sans décaler les dates « jour seul » (UTC midnight → 01:00).
 */
export function formatDateTime(dateString: string, locale = 'fr-FR'): string {
  const raw = dateString.trim();
  if (!raw) return '—';

  // yyyy-MM-dd → midi local pour éviter minuit UTC
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T12:00:00` : raw;
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return raw;

  return d.toLocaleString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
