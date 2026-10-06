import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle, HelpCircle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ConfirmOptions = {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** destructive : suppression (rouge) · warning : action sensible · default : simple validation */
  tone?: 'destructive' | 'warning' | 'default';
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

const TONES = {
  destructive: { icon: Trash2, ring: 'bg-destructive/10 text-destructive', button: 'destructive' as const },
  warning: { icon: AlertTriangle, ring: 'bg-amber-500/10 text-amber-600', button: 'default' as const },
  default: { icon: HelpCircle, ring: 'bg-primary/10 text-primary', button: 'default' as const },
};

/**
 * Remplace `window.confirm` (bloquant, non stylé, parfois désactivé par le navigateur / la PWA).
 * Usage : `const confirm = useConfirm(); if (await confirm({ title: 'Supprimer ?', tone: 'destructive' })) …`
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    // Une confirmation déjà ouverte est annulée avant d'en ouvrir une nouvelle.
    resolver.current?.(false);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setOptions(opts);
    });
  }, []);

  const settle = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  };

  const tone = TONES[options?.tone ?? 'default'];
  const Icon = tone.icon;
  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <AlertDialog open={options !== null} onOpenChange={(open) => !open && settle(false)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="items-center text-center sm:items-start sm:text-left">
            <div className={cn('mb-1 flex h-12 w-12 items-center justify-center rounded-full', tone.ring)}>
              <Icon className="h-6 w-6" aria-hidden />
            </div>
            <AlertDialogTitle>{options?.title}</AlertDialogTitle>
            {options?.description ? (
              <AlertDialogDescription asChild>
                <div className="text-sm text-muted-foreground">{options.description}</div>
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="mt-0">{options?.cancelLabel ?? 'Annuler'}</AlertDialogCancel>
            <Button variant={tone.button} autoFocus onClick={() => settle(true)}>
              {options?.confirmLabel ?? (options?.tone === 'destructive' ? 'Supprimer' : 'Confirmer')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm doit être utilisé dans <ConfirmProvider>');
  return ctx;
}
