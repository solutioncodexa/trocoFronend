/**
 * Loader neutre — pas de couleurs Matjarona (évite le flash rose avant bootstrap boutique).
 */
export function NeutralBootLoader({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 text-neutral-600"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700"
        aria-hidden
      />
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{label}</p>
    </div>
  );
}

export default NeutralBootLoader;
