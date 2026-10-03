import { useState } from 'react';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';

/**
 * Champ pour une clé ou un secret : masqué par défaut, jamais renvoyé dans la conversation.
 * La valeur ne quitte ce composant que pour être envoyée à l'API de la boutique.
 */
export function SecretWidget({
  onSubmit,
  onSkip,
  busy,
  secret,
  placeholder,
}: {
  onSubmit: (value: string) => void;
  onSkip: () => void;
  busy?: boolean;
  secret: boolean;
  placeholder: string;
}) {
  const { t } = useAdminLocale();
  const [value, setValue] = useState('');
  const [shown, setShown] = useState(false);
  return (
    <form
      className="mt-2 space-y-2"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
    >
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type={secret && !shown ? 'password' : 'text'}
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
          maxLength={300}
          placeholder={placeholder}
          aria-label={placeholder}
          disabled={busy}
        />
        {secret ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-9 w-9 shrink-0"
            onClick={() => setShown((s) => !s)}
            aria-label={t('assistant.pay.field.show')}
            title={t('assistant.pay.field.show')}
          >
            {shown ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </Button>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={busy || !value.trim()}>
          {busy ? <Loader2 className="me-1.5 h-4 w-4 animate-spin" aria-hidden /> : null}
          {t('assistant.flow.save')}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onSkip} disabled={busy}>
          {t('assistant.flow.skip')}
        </Button>
        {secret ? <ShieldCheck className="ms-auto h-4 w-4 text-emerald-600" aria-hidden /> : null}
      </div>
    </form>
  );
}

/** Récapitulatif avant création, avec libellés de boutons au choix. */
export function SummaryWidget({
  rows,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy,
}: {
  rows: { label: string; value: string }[];
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  return (
    <div className="mt-2 space-y-2">
      <dl className="space-y-1 rounded-lg border bg-background p-2 text-xs">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2">
            <dt className="shrink-0 font-medium text-muted-foreground">{r.label}</dt>
            <dd className="min-w-0 break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={onConfirm} disabled={busy}>
          {busy ? <Loader2 className="me-1.5 h-4 w-4 animate-spin" aria-hidden /> : null}
          {confirmLabel}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
}
