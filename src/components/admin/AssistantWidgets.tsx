import { useRef, useState } from 'react';
import { ExternalLink, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { COLOR_PRESETS, isHexColor } from '@/config/assistantFlow';
import type { Palette } from '@/config/paletteFromImage';
import { cn } from '@/lib/utils';

/** Lien vers l'aperçu en direct de l'apparence, ouvert dans un autre onglet pour garder la conversation. */
export const LIVE_PREVIEW_HREF = '/admin/parametres?section=identity';

type SkipProps = { onSkip: () => void; busy?: boolean };

export function YesNoWidget({ onYes, onNo, busy }: { onYes: () => void; onNo: () => void; busy?: boolean }) {
  const { t } = useAdminLocale();
  return (
    <div className="mt-2 flex gap-2">
      <Button type="button" size="sm" onClick={onYes} disabled={busy}>
        {t('assistant.flow.yes')}
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={onNo} disabled={busy}>
        {t('assistant.flow.no')}
      </Button>
    </div>
  );
}

export function UploadWidget({ onFile, onSkip, busy }: SkipProps & { onFile: (file: File) => void }) {
  const { t } = useAdminLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
      <Button type="button" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? <Loader2 className="me-1.5 h-4 w-4 animate-spin" aria-hidden /> : <ImagePlus className="me-1.5 h-4 w-4" aria-hidden />}
        {busy ? t('assistant.flow.logo.uploading') : t('assistant.flow.logo.pick')}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onSkip} disabled={busy}>
        {t('assistant.flow.skip')}
      </Button>
    </div>
  );
}

export function ColorsWidget({
  onApply,
  onSkip,
  busy,
  logoPalette,
}: SkipProps & { onApply: (primary: string, secondary: string) => void; logoPalette?: Palette | null }) {
  const { t } = useAdminLocale();
  const [primary, setPrimary] = useState(COLOR_PRESETS[0].primary);
  const [secondary, setSecondary] = useState(COLOR_PRESETS[0].secondary);
  const valid = isHexColor(primary) && isHexColor(secondary);

  return (
    <div className="mt-2 space-y-3">
      <div className="flex flex-wrap gap-2">
        {logoPalette ? (
          <button
            type="button"
            onClick={() => {
              setPrimary(logoPalette.primary);
              setSecondary(logoPalette.secondary);
            }}
            className="flex h-8 items-center gap-1.5 rounded-full border border-primary/40 px-2 text-xs transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: logoPalette.primary }} aria-hidden />
            <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: logoPalette.secondary }} aria-hidden />
            {t('assistant.flow.colors.fromLogo')}
          </button>
        ) : null}
        {COLOR_PRESETS.map((p) => (
          <button
            key={p.primary}
            type="button"
            aria-label={p.primary}
            title={p.primary}
            onClick={() => {
              setPrimary(p.primary);
              setSecondary(p.secondary);
            }}
            className={cn(
              'h-8 w-8 rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              primary.toLowerCase() === p.primary.toLowerCase() ? 'border-foreground' : 'border-transparent',
            )}
            style={{ backgroundColor: p.primary }}
          />
        ))}
        <label className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-2 text-xs">
          <input
            type="color"
            value={isHexColor(primary) ? primary : '#2563eb'}
            onChange={(e) => setPrimary(e.target.value)}
            className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            aria-label={t('assistant.flow.colors.custom')}
          />
          {t('assistant.flow.colors.custom')}
        </label>
      </div>

      <div className="rounded-lg border bg-background p-3" aria-label={t('assistant.flow.colors.preview')}>
        <p className="mb-2 text-xs text-muted-foreground">{t('assistant.flow.colors.preview')}</p>
        <div className="flex items-center gap-3">
          <span
            className="rounded-md px-3 py-1.5 text-sm font-medium text-white"
            style={{ backgroundColor: isHexColor(primary) ? primary : undefined }}
          >
            {t('assistant.flow.colors.sample')}
          </span>
          <span className="text-sm font-semibold" style={{ color: isHexColor(primary) ? primary : undefined }}>
            {primary.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => onApply(primary.toUpperCase(), secondary.toUpperCase())} disabled={busy || !valid}>
          {busy ? <Loader2 className="me-1.5 h-4 w-4 animate-spin" aria-hidden /> : null}
          {t('assistant.flow.colors.apply')}
        </Button>
        <Button type="button" size="sm" variant="outline" asChild>
          <a href={LIVE_PREVIEW_HREF} target="_blank" rel="noreferrer">
            <ExternalLink className="me-1.5 h-4 w-4" aria-hidden />
            {t('assistant.flow.colors.live')}
          </a>
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onSkip} disabled={busy}>
          {t('assistant.flow.skip')}
        </Button>
      </div>
    </div>
  );
}

export function TextWidget({
  onSubmit,
  onSkip,
  busy,
  placeholder,
  inputMode,
}: SkipProps & { onSubmit: (value: string) => void; placeholder?: string; inputMode?: 'text' | 'tel' | 'decimal' }) {
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
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={120}
        disabled={busy}
        aria-label={placeholder}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={busy || !value.trim()}>
          {busy ? <Loader2 className="me-1.5 h-4 w-4 animate-spin" aria-hidden /> : null}
          {t('assistant.flow.save')}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onSkip} disabled={busy}>
          {t('assistant.flow.skip')}
        </Button>
      </div>
    </form>
  );
}

export function LinkWidget({ href, openLabel, onContinue }: { href: string; openLabel: string; onContinue: () => void }) {
  const { t } = useAdminLocale();
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <Button type="button" size="sm" variant="outline" asChild>
        <a href={href} target="_blank" rel="noreferrer">
          <ExternalLink className="me-1.5 h-4 w-4" aria-hidden />
          {openLabel}
        </a>
      </Button>
      <Button type="button" size="sm" onClick={onContinue}>
        {t('assistant.flow.continue')}
      </Button>
    </div>
  );
}
