import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, FileSpreadsheet, Loader2, Upload } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { productsApi } from '@/services/api/products';
import { CSV_TEMPLATE, MAX_IMPORT_ROWS, parseCsv, planImport, type ImportPlan, type ImportRow } from '@/config/productImport';
import { runProductImport, type ImportOutcome } from '@/utils/productImporter';
import { formatPrice } from '@/utils/formatPrice';

const PREVIEW_ROWS = 25;

const AdminProductImport = () => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [outcome, setOutcome] = useState<ImportOutcome | null>(null);

  // Noms déjà présents : une ligne au même nom est signalée « déjà présent » et n'est pas importée.
  const { data: existing } = useQuery({
    queryKey: ['products', 'import-existing'],
    queryFn: () => productsApi.getAllProducts({ page: 0, size: 200 }),
    staleTime: 30_000,
  });

  const reset = () => {
    setPlan(null);
    setOutcome(null);
    setError(null);
    setProgress(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setOutcome(null);
    try {
      const text = await file.text();
      const next = planImport(
        parseCsv(text),
        (existing?.content ?? []).map((p) => p.name),
      );
      if (next.missing.length > 0) {
        setPlan(null);
        setError(t('import.missing', { cols: next.missing.map((m) => (m === 'name' ? t('import.col.name') : t('import.col.price'))).join(', ') }));
        return;
      }
      setPlan(next);
    } catch {
      setPlan(null);
      setError(t('import.readError'));
    }
  };

  const downloadTemplate = () => {
    // BOM pour qu'Excel ouvre correctement les accents.
    const blob = new Blob([`${String.fromCharCode(0xfeff)}${CSV_TEMPLATE}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modele-produits.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importable: ImportRow[] = plan?.rows.filter((r) => r.errors.length === 0) ?? [];
  const bad = plan?.rows.filter((r) => r.errors.some((e) => e !== 'duplicate')).length ?? 0;
  const dup = plan?.rows.filter((r) => r.errors.length === 1 && r.errors[0] === 'duplicate').length ?? 0;

  const start = async () => {
    setProgress({ done: 0, total: importable.length });
    const result = await runProductImport(importable, t('import.defaultCategory'), (done, total) =>
      setProgress({ done, total }),
    );
    setProgress(null);
    setOutcome(result);
    setPlan(null);
    void queryClient.invalidateQueries({ predicate: (q) => /product|categor/i.test(JSON.stringify(q.queryKey)) });
  };

  const errorLabel = (r: ImportRow) =>
    r.errors.length === 0
      ? t('import.ok')
      : r.errors.map((e) => t(`import.err.${e}` as 'import.err.name')).join(', ');

  return (
    <AdminLayout
      title={t('import.title')}
      description={t('import.description')}
      breadcrumbs={[{ label: t('import.title') }]}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">{t('import.step.file')}</h2>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
            <Button type="button" onClick={() => fileRef.current?.click()} disabled={progress !== null}>
              <Upload className="me-2 h-4 w-4" aria-hidden />
              {t('import.pick')}
            </Button>
            <Button type="button" variant="outline" onClick={downloadTemplate}>
              <Download className="me-2 h-4 w-4" aria-hidden />
              {t('import.template')}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{t('import.hint')}</p>
          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}
        </section>

        {plan ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold">{t('import.step.preview')}</h2>
            <p className="text-sm">{t('import.summary', { ok: importable.length, bad, dup })}</p>
            {plan.ignoredColumns.length > 0 ? (
              <p className="text-xs text-muted-foreground">{t('import.ignored', { cols: plan.ignoredColumns.join(', ') })}</p>
            ) : null}
            {plan.truncated ? (
              <p className="text-xs text-amber-700">{t('import.truncated', { max: MAX_IMPORT_ROWS })}</p>
            ) : null}
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    {(['line', 'name', 'price', 'category', 'stock', 'status'] as const).map((c) => (
                      <th key={c} className="px-3 py-2 text-start font-medium">
                        {t(`import.col.${c}` as 'import.col.line')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plan.rows.slice(0, PREVIEW_ROWS).map((r) => (
                    <tr key={r.line} className={r.errors.length ? 'bg-destructive/5' : ''}>
                      <td className="px-3 py-1.5 text-muted-foreground">{r.line}</td>
                      <td className="px-3 py-1.5">{r.name || '—'}</td>
                      <td className="px-3 py-1.5">{r.price === null ? '—' : formatPrice(r.price)}</td>
                      <td className="px-3 py-1.5">{r.category || t('import.defaultCategory')}</td>
                      <td className="px-3 py-1.5">{r.stock ?? '—'}</td>
                      <td className={`px-3 py-1.5 ${r.errors.length ? 'text-destructive' : 'text-emerald-700'}`}>{errorLabel(r)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" disabled={importable.length === 0 || progress !== null} onClick={() => void start()}>
                {progress ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : <FileSpreadsheet className="me-2 h-4 w-4" aria-hidden />}
                {progress
                  ? t('import.running', { done: progress.done, total: progress.total })
                  : t('import.start', { n: importable.length })}
              </Button>
              <Button type="button" variant="ghost" onClick={reset} disabled={progress !== null}>
                {t('import.again')}
              </Button>
            </div>
          </section>
        ) : null}

        {outcome ? (
          <section className="space-y-3 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <p className="font-display text-lg font-semibold">{t('import.done', { n: outcome.created })}</p>
            {outcome.failures.length > 0 ? (
              <p role="alert" className="text-sm text-destructive">
                {t('import.failed', { n: outcome.failures.length, first: `${outcome.failures[0].name} — ${outcome.failures[0].message}` })}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/admin/produits">{t('import.seeProducts')}</Link>
              </Button>
              <Button type="button" variant="outline" onClick={reset}>
                {t('import.again')}
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminProductImport;
