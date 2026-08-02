import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Options = {
  /** true = des changements non enregistrés existent */
  isDirty: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

/**
 * Demande confirmation avant de quitter (liens internes, retour navigateur, fermeture onglet)
 * uniquement si `isDirty` est vrai.
 */
export function useUnsavedChangesGuard({
  isDirty,
  title = 'Modifications non enregistrées',
  description = 'Vous avez des modifications non enregistrées. Si vous quittez maintenant, elles seront perdues.',
  confirmLabel = 'Quitter sans enregistrer',
  cancelLabel = 'Rester sur la page',
}: Options) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pendingBack, setPendingBack] = useState(false);
  const bypassRef = useRef(false);

  // Fermeture / refresh navigateur
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (bypassRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  // Clics sur liens internes (sidebar admin, etc.)
  useEffect(() => {
    if (!isDirty) return;

    const onClick = (e: MouseEvent) => {
      if (bypassRef.current) return;
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const hrefAttr = anchor.getAttribute('href');
      if (!hrefAttr || hrefAttr.startsWith('#') || hrefAttr.startsWith('mailto:')) return;

      let url: URL;
      try {
        url = new URL(hrefAttr, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      const next = `${url.pathname}${url.search}${url.hash}`;
      const current = `${location.pathname}${location.search}${location.hash}`;
      if (next === current) return;

      e.preventDefault();
      e.stopPropagation();
      setPendingBack(false);
      setPendingHref(next);
      setOpen(true);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [isDirty, location.pathname, location.search, location.hash]);

  // Bouton retour navigateur
  useEffect(() => {
    if (!isDirty) return;

    const onPopState = () => {
      if (bypassRef.current) return;
      // Annule le retour immédiat, propose la confirmation
      window.history.pushState(null, '', window.location.href);
      setPendingHref(null);
      setPendingBack(true);
      setOpen(true);
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [isDirty]);

  const stay = useCallback(() => {
    setOpen(false);
    setPendingHref(null);
    setPendingBack(false);
  }, []);

  const leave = useCallback(() => {
    const href = pendingHref;
    const goBack = pendingBack;
    bypassRef.current = true;
    setOpen(false);
    setPendingHref(null);
    setPendingBack(false);
    if (goBack) {
      // 1 entrée = garde, 1 entrée = page précédente réelle
      window.history.go(-2);
      return;
    }
    if (href) navigate(href);
  }, [navigate, pendingBack, pendingHref]);

  const dialog = useMemo(
    () => (
      <AlertDialog open={open} onOpenChange={(v) => (!v ? stay() : setOpen(v))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={stay}>{cancelLabel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={leave}
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    [open, title, description, cancelLabel, confirmLabel, stay, leave],
  );

  return { dialog, isDirty };
}
