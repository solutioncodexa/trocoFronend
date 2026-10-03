import { useMemo, useRef, useState } from 'react';
import { ImagePlus, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { ACTIVITIES, type ActivityId, type LocalizedNode, type SelectedCat } from '@/config/catalogTemplates';
import { cn } from '@/lib/utils';

const chip =
  'rounded-full border px-3 py-1 text-xs transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50';

export function ActivityWidget({
  onPick,
  onCustom,
  busy,
}: {
  onPick: (id: ActivityId) => void;
  onCustom: (text: string) => void;
  busy?: boolean;
}) {
  const { t } = useAdminLocale();
  const [other, setOther] = useState('');
  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap gap-2">
        {ACTIVITIES.map((id) => (
          <button key={id} type="button" className={chip} disabled={busy} onClick={() => onPick(id)}>
            {t(`assistant.catalog.activity.${id}`)}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (other.trim()) onCustom(other.trim());
        }}
      >
        <Input
          value={other}
          onChange={(e) => setOther(e.target.value)}
          placeholder={t('assistant.catalog.activity.otherPlaceholder')}
          aria-label={t('assistant.catalog.activity.otherPlaceholder')}
          maxLength={80}
          disabled={busy}
        />
        <Button type="submit" size="sm" disabled={busy || !other.trim()}>
          {t('assistant.flow.continue')}
        </Button>
      </form>
    </div>
  );
}

/** Arbre catégories / sous-catégories : cocher, décocher, ajouter les siennes. */
export function CatTreeWidget({
  nodes,
  onConfirm,
  busy,
}: {
  nodes: LocalizedNode[];
  onConfirm: (selected: SelectedCat[]) => void;
  busy?: boolean;
}) {
  const { t } = useAdminLocale();
  const [tree, setTree] = useState<LocalizedNode[]>(nodes);
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(nodes.flatMap((p) => [p.key, ...p.children.map((c) => c.key)])),
  );
  const [draft, setDraft] = useState('');
  const [parentKey, setParentKey] = useState('');
  const counter = useRef(0);

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const selected = useMemo<SelectedCat[]>(() => {
    const out: SelectedCat[] = [];
    for (const p of tree) {
      const kids = p.children.filter((c) => checked.has(c.key));
      if (checked.has(p.key) || kids.length) out.push({ key: p.key, name: p.name, parentKey: null });
      kids.forEach((c) => out.push({ key: c.key, name: c.name, parentKey: p.key }));
    }
    return out;
  }, [tree, checked]);

  const add = () => {
    const name = draft.trim();
    if (!name) return;
    counter.current += 1;
    const key = `custom:${counter.current}`;
    setTree((prev) =>
      parentKey
        ? prev.map((p) => (p.key === parentKey ? { ...p, children: [...p.children, { key, name }] } : p))
        : [...prev, { key, name, children: [] }],
    );
    setChecked((prev) => new Set(prev).add(key));
    setDraft('');
  };

  return (
    <div className="mt-2 space-y-3">
      <ul className="max-h-56 space-y-2 overflow-y-auto rounded-lg border bg-background p-2">
        {tree.map((p) => (
          <li key={p.key}>
            <label className="flex items-center gap-2 font-medium">
              <input type="checkbox" checked={checked.has(p.key)} onChange={() => toggle(p.key)} disabled={busy} />
              {p.name}
            </label>
            {p.children.length ? (
              <ul className="ms-6 mt-1 space-y-1">
                {p.children.map((c) => (
                  <li key={c.key}>
                    <label className="flex items-center gap-2 text-muted-foreground">
                      <input type="checkbox" checked={checked.has(c.key)} onChange={() => toggle(c.key)} disabled={busy} />
                      {c.name}
                    </label>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <select
          value={parentKey}
          onChange={(e) => setParentKey(e.target.value)}
          className="h-9 rounded-md border bg-background px-2 text-xs"
          aria-label={t('assistant.catalog.tree.parentTop')}
          disabled={busy}
        >
          <option value="">{t('assistant.catalog.tree.parentTop')}</option>
          {tree.map((p) => (
            <option key={p.key} value={p.key}>
              {p.name}
            </option>
          ))}
        </select>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('assistant.catalog.tree.addPlaceholder')}
          aria-label={t('assistant.catalog.tree.addPlaceholder')}
          maxLength={80}
          className="min-w-0 flex-1"
          disabled={busy}
        />
        <Button type="submit" size="icon" variant="outline" className="h-9 w-9" disabled={busy || !draft.trim()} aria-label={t('assistant.catalog.tree.add')}>
          <Plus className="h-4 w-4" aria-hidden />
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Button type="button" size="sm" onClick={() => onConfirm(selected)} disabled={busy || selected.length === 0}>
          {busy ? <Loader2 className="me-1.5 h-4 w-4 animate-spin" aria-hidden /> : null}
          {busy ? t('assistant.catalog.tree.creating') : t('assistant.catalog.tree.create')}
        </Button>
        <span className="text-xs text-muted-foreground">{t('assistant.catalog.tree.count', { n: selected.length })}</span>
      </div>
    </div>
  );
}

export function CategoryPickWidget({
  options,
  onPick,
  busy,
}: {
  options: { slug: string; label: string }[];
  onPick: (slug: string, label: string) => void;
  busy?: boolean;
}) {
  return (
    <div className="mt-2 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
      {options.map((o) => (
        <button key={o.slug} type="button" className={chip} disabled={busy} onClick={() => onPick(o.slug, o.label)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Champ de saisie avec suggestions cliquables et, au besoin, une proposition de texte à reprendre. */
export function FieldWidget({
  onSubmit,
  onSkip,
  busy,
  placeholder,
  inputMode,
  multiline,
  suggestions,
  proposal,
}: {
  onSubmit: (value: string) => void;
  onSkip?: () => void;
  busy?: boolean;
  placeholder?: string;
  inputMode?: 'text' | 'decimal' | 'numeric';
  multiline?: boolean;
  suggestions?: string[];
  proposal?: string;
}) {
  const { t } = useAdminLocale();
  const [value, setValue] = useState('');
  return (
    <form
      className="mt-2 space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
    >
      {proposal ? (
        <div className="space-y-2 rounded-lg border border-primary/30 bg-background p-2 text-xs">
          <p className="whitespace-pre-wrap">{proposal}</p>
          <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => onSubmit(proposal)}>
            {t('assistant.catalog.product.descUse')}
          </Button>
        </div>
      ) : null}
      {suggestions?.length ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} type="button" className={chip} disabled={busy} onClick={() => onSubmit(s)}>
              {s}
            </button>
          ))}
        </div>
      ) : null}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          rows={3}
          maxLength={2000}
          disabled={busy}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          inputMode={inputMode}
          maxLength={200}
          disabled={busy}
        />
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={busy || !value.trim()}>
          {busy ? <Loader2 className="me-1.5 h-4 w-4 animate-spin" aria-hidden /> : null}
          {t('assistant.flow.save')}
        </Button>
        {onSkip ? (
          <Button type="button" size="sm" variant="ghost" onClick={onSkip} disabled={busy}>
            {t('assistant.flow.skip')}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function PhotosWidget({
  onConfirm,
  onSkip,
  busy,
}: {
  onConfirm: (files: File[]) => void;
  onSkip: () => void;
  busy?: boolean;
}) {
  const { t } = useAdminLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onConfirm(files);
          e.target.value = '';
        }}
      />
      <Button type="button" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
        <ImagePlus className="me-1.5 h-4 w-4" aria-hidden />
        {t('assistant.catalog.product.photosPick')}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onSkip} disabled={busy}>
        {t('assistant.flow.skip')}
      </Button>
    </div>
  );
}

export function ConfirmProductWidget({
  rows,
  onCreate,
  onCancel,
  busy,
}: {
  rows: { label: string; value: string }[];
  onCreate: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const { t } = useAdminLocale();
  return (
    <div className="mt-2 space-y-2">
      <dl className="space-y-1 rounded-lg border bg-background p-2 text-xs">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2">
            <dt className={cn('shrink-0 font-medium text-muted-foreground')}>{r.label}</dt>
            <dd className="min-w-0 break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={onCreate} disabled={busy}>
          {busy ? <Loader2 className="me-1.5 h-4 w-4 animate-spin" aria-hidden /> : null}
          {t('assistant.catalog.product.create')}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel} disabled={busy}>
          {t('assistant.catalog.product.cancel')}
        </Button>
      </div>
    </div>
  );
}
