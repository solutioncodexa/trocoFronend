import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FolderTree,
  LayoutDashboard,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Store,
  Warehouse,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import {
  ADMIN_LOCALES,
  ADMIN_LOCALE_LABELS,
  type AdminLocale,
  type AdminMessageKey,
} from '@/i18n/admin/adminMessages';
import * as authApi from '@/services/api/auth';
import { toastError } from '@/utils/toastMessages';

type GuideStepDef = {
  id: string;
  icon: typeof BookOpen;
  bulletKeys: AdminMessageKey[];
  tipKey?: AdminMessageKey;
  href?: string;
  ctaKey?: AdminMessageKey;
};

/** Définition structurelle (textes via i18n fr/ar/en). */
export const GUIDE_STEP_DEFS: GuideStepDef[] = [
  {
    id: 'welcome',
    icon: BookOpen,
    bulletKeys: ['guide.welcome.b1', 'guide.welcome.b2', 'guide.welcome.b3'],
    tipKey: 'guide.welcome.tip',
  },
  {
    id: 'assistant',
    icon: Palette,
    bulletKeys: ['guide.assistant.b1', 'guide.assistant.b2', 'guide.assistant.b3'],
    tipKey: 'guide.assistant.tip',
    href: '/admin/onboarding',
    ctaKey: 'guide.assistant.cta',
  },
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    bulletKeys: ['guide.dashboard.b1', 'guide.dashboard.b2', 'guide.dashboard.b3'],
    href: '/admin/dashboard',
    ctaKey: 'guide.dashboard.cta',
  },
  {
    id: 'catalog',
    icon: Package,
    bulletKeys: [
      'guide.catalog.b1',
      'guide.catalog.b2',
      'guide.catalog.b3',
      'guide.catalog.b4',
    ],
    tipKey: 'guide.catalog.tip',
    href: '/admin/produits?action=new',
    ctaKey: 'guide.catalog.cta',
  },
  {
    id: 'categories',
    icon: FolderTree,
    bulletKeys: ['guide.categories.b1', 'guide.categories.b2', 'guide.categories.b3'],
    href: '/admin/categories',
    ctaKey: 'guide.categories.cta',
  },
  {
    id: 'orders',
    icon: ShoppingCart,
    bulletKeys: [
      'guide.orders.b1',
      'guide.orders.b2',
      'guide.orders.b3',
      'guide.orders.b4',
    ],
    href: '/admin/commandes',
    ctaKey: 'guide.orders.cta',
  },
  {
    id: 'stock',
    icon: Warehouse,
    bulletKeys: ['guide.stock.b1', 'guide.stock.b2', 'guide.stock.b3'],
    href: '/admin/stock',
    ctaKey: 'guide.stock.cta',
  },
  {
    id: 'storefront',
    icon: Store,
    bulletKeys: ['guide.storefront.b1', 'guide.storefront.b2', 'guide.storefront.b3'],
    href: '/admin/boutique-en-ligne',
    ctaKey: 'guide.storefront.cta',
  },
  {
    id: 'settings',
    icon: Settings,
    bulletKeys: ['guide.settings.b1', 'guide.settings.b2', 'guide.settings.b3'],
    tipKey: 'guide.settings.tip',
    href: '/admin/parametres',
    ctaKey: 'guide.settings.cta',
  },
  {
    id: 'ready',
    icon: CheckCircle2,
    bulletKeys: ['guide.ready.b1', 'guide.ready.b2', 'guide.ready.b3'],
  },
];

/** @deprecated alias pour les tests — préférer GUIDE_STEP_DEFS */
export const GUIDE_STEPS = GUIDE_STEP_DEFS;

type Props = {
  forceOpen?: boolean;
  onForceOpenHandled?: () => void;
};

function titleKey(id: string): AdminMessageKey {
  return `guide.${id}.title` as AdminMessageKey;
}
function summaryKey(id: string): AdminMessageKey {
  return `guide.${id}.summary` as AdminMessageKey;
}

/**
 * Guide 1ère utilisation admin (fr / ar / en) — persisté via PATCH /auth/me/admin-guide.
 */
const AdminFirstUseGuide = ({ forceOpen = false, onForceOpenHandled }: Props) => {
  const { user, isSuperAdmin, setUser } = useAdmin();
  const { t, dir, locale, setLocale } = useAdminLocale();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const shouldAutoShow = useMemo(() => {
    if (!user || isSuperAdmin) return false;
    if (user.role !== 'ADMIN' && user.role !== 'STAFF') return false;
    return user.adminGuideCompleted !== true;
  }, [user, isSuperAdmin]);

  useEffect(() => {
    if (forceOpen) {
      setStep(0);
      setOpen(true);
      onForceOpenHandled?.();
      return;
    }
    if (shouldAutoShow) {
      setStep(0);
      setOpen(true);
    }
  }, [forceOpen, shouldAutoShow, onForceOpenHandled]);

  const def = GUIDE_STEP_DEFS[step];
  const Icon = def.icon;
  const isLast = step >= GUIDE_STEP_DEFS.length - 1;
  const PrevIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;
  const NextIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const persistCompleted = async (completed: boolean) => {
    setSaving(true);
    try {
      const updated = await authApi.updateAdminGuide({ completed });
      if (updated) setUser(updated);
    } catch (err) {
      toastError(err, t('guide.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async (markDone: boolean) => {
    setOpen(false);
    if (markDone && user?.adminGuideCompleted !== true) {
      await persistCompleted(true);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      void handleClose(true);
    } else {
      setOpen(true);
    }
  };

  if (!user || isSuperAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex max-h-[min(92vh,720px)] w-[calc(100%-1.5rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl"
        dir={dir}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="shrink-0 space-y-1 border-b border-border px-5 py-4 text-start sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {t('guide.badge', {
                  current: step + 1,
                  total: GUIDE_STEP_DEFS.length,
                })}
              </p>
              <DialogTitle className="font-display text-xl text-foreground">
                {t(titleKey(def.id))}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                {t(summaryKey(def.id))}
              </DialogDescription>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <div
                className="flex rounded-lg border border-border bg-muted/40 p-0.5"
                role="group"
                aria-label={t('common.language')}
              >
                {ADMIN_LOCALES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={locale === code}
                    aria-label={ADMIN_LOCALE_LABELS[code]}
                    className={cn(
                      'rounded-md px-2 py-1 text-[11px] font-semibold transition-colors',
                      locale === code
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setLocale(code as AdminLocale)}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label={t('guide.close')}
                disabled={saving}
                onClick={() => void handleClose(true)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-3 flex gap-1">
            {GUIDE_STEP_DEFS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={t('guide.stepAria', { n: i + 1 })}
                onClick={() => setStep(i)}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  i <= step ? 'bg-primary' : 'bg-muted',
                )}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <ul className="space-y-2.5">
            {def.bulletKeys.map((key) => (
              <li key={key} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
          {def.tipKey ? (
            <p className="mt-4 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{t('guide.tipLabel')}</span>
              {t(def.tipKey)}
            </p>
          ) : null}
          {def.href && def.ctaKey ? (
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to={def.href} onClick={() => void handleClose(false)}>
                {t(def.ctaKey)}
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-muted/20 px-5 py-3 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={step === 0 || saving}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <PrevIcon className="me-1 h-4 w-4" />
            {t('guide.prev')}
          </Button>
          <div className="flex gap-2">
            {!isLast ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={saving}
                onClick={() => void handleClose(true)}
              >
                {t('guide.skip')}
              </Button>
            ) : null}
            {isLast ? (
              <Button type="button" size="sm" disabled={saving} onClick={() => void handleClose(true)}>
                {saving ? t('guide.saving') : t('guide.finish')}
              </Button>
            ) : (
              <Button type="button" size="sm" onClick={() => setStep((s) => s + 1)}>
                {t('guide.next')}
                <NextIcon className="ms-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminFirstUseGuide;
