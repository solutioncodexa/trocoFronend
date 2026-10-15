import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  ShoppingCart,
  Palette,
  TrendingUp,
  AlertTriangle,
  PackageX,
  FolderOpen,
  CheckCircle2,
  ExternalLink,
  Store,
  ImagePlus,
  Phone,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck } from 'lucide-react';
import { assistantApi } from '@/services/api/assistant';
import AiUsageCard from '@/components/admin/AiUsageCard';
import { shippingApi } from '@/services/api/shipping';
import { requestAssistantFlow, type AssistantFlowId } from '@/utils/assistantBus';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import { Button } from '@/components/ui/button';
import { ordersApi } from '@/services/api/orders';
import { customOrdersApi } from '@/services/api/customOrders';
import { statsApi } from '@/services/api/stats';
import { platformApi } from '@/services/api/platform';
import { formatPrice } from '@/utils/formatPrice';
import { getImageUrl } from '@/services/api';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { useOpenStorefront } from '@/hooks/useOpenStorefront';
import { buildStorefrontUrl } from '@/utils/storefrontUrl';
import { storePagesApi } from '@/services/api/storePages';
import { listDemoProducts } from '@/utils/starterPack';
import { MENTIONS_PAGE_SLUG, PRIVACY_PAGE_SLUG, TERMS_PAGE_SLUG } from '@/config/legalPages';
import { toast } from 'sonner';

const ORDER_STATUS_KEYS: Record<string, AdminMessageKey> = {
  new: 'status.new',
  confirmed: 'status.confirmed',
  delivered: 'status.delivered',
  cancelled: 'status.cancelled',
  pending: 'common.pending',
  contacted: 'status.contacted',
  completed: 'status.completed',
};

/** « Boutique partagée » : mémorisé par boutique dans ce navigateur (rien à suivre côté serveur). */
const sharedKey = (slug?: string | null) => `troco.storeShared.${slug ?? ''}`;

function readShared(slug?: string | null): boolean {
  try {
    return !!slug && localStorage.getItem(sharedKey(slug)) === '1';
  } catch {
    return false;
  }
}

const AdminDashboard = () => {
  const { t } = useAdminLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const { siteName, logoUrl, slug, store } = useStoreBrand();
  const { openStorefront, canViewPublic } = useOpenStorefront();
  const queryClient = useQueryClient();

  useEffect(() => {
    const state = location.state as { onboarding?: boolean; pendingActivation?: boolean } | null;
    if (state?.onboarding) {
      toast.success(
        state.pendingActivation
          ? t('dashboard.toastCreatedPending')
          : t('dashboard.toastWelcomeChecklist'),
      );
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate, t]);

  const { data: dash } = useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: () => statsApi.getDashboard(),
  });
  const { data: storeSettings } = useQuery({
    queryKey: ['store-settings', 'me', 'summary'],
    queryFn: () => platformApi.getMyStoreSummary(),
  });
  const { data: fullSettings } = useQuery({
    queryKey: ['store-settings', 'me'],
    queryFn: () => platformApi.getMyStoreSettings(),
  });
  const { data: demoProducts = [] } = useQuery({
    queryKey: ['products', 'onboarding-demo'],
    queryFn: () => listDemoProducts(),
    staleTime: 30_000,
  });
  const { data: pages = [] } = useQuery({
    queryKey: ['store-pages'],
    queryFn: () => storePagesApi.list(),
    staleTime: 30_000,
  });
  const { data: assistantStatus } = useQuery({
    queryKey: ['assistant-status'],
    queryFn: assistantApi.status,
    staleTime: Infinity,
    retry: false,
  });
  const { data: carriers } = useQuery({
    queryKey: ['shipping-carriers', 'admin'],
    queryFn: () => shippingApi.listAdmin(),
    staleTime: 30_000,
  });
  const launchStore = useMutation({
    mutationFn: () => platformApi.setStorefrontLive(true),
    onSuccess: () => {
      toast.success(t('launch.done'));
      void queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    },
    onError: () => toast.error(t('launch.error')),
  });
  const storefrontUrl = buildStorefrontUrl(slug || store?.slug || storeSettings?.slug);
  const storeSlug = slug || store?.slug || storeSettings?.slug;
  const [shared, setShared] = useState(() => readShared(storeSlug));
  useEffect(() => setShared(readShared(storeSlug)), [storeSlug]);
  const markShared = () => {
    setShared(true);
    try {
      if (storeSlug) localStorage.setItem(sharedKey(storeSlug), '1');
    } catch {
      // stockage indisponible : la case restera simplement à cocher
    }
  };
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    t('dashboard.shareMessage', { name: siteName || '', url: storefrontUrl }),
  )}`;
  const { data: ordersPage } = useQuery({
    queryKey: ['orders', 'dashboard'],
    queryFn: () => ordersApi.getAllOrders({ page: 0, size: 5 }),
  });
  const { data: customOrdersPage } = useQuery({
    queryKey: ['customOrders', 'dashboard'],
    queryFn: () => customOrdersApi.getAllCustomOrders({ page: 0, size: 5, status: 'pending' }),
  });

  const orders = ordersPage?.content ?? [];
  const customOrders = customOrdersPage?.content ?? [];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200',
      confirmed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200',
      pending: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200',
      contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200',
    };
    const labelKey = ORDER_STATUS_KEYS[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-body ${styles[status] ?? 'bg-muted text-muted-foreground'}`}>
        {labelKey ? t(labelKey) : status}
      </span>
    );
  };

  const productCount = dash?.productCount ?? 0;
  // Les produits d'exemple (SKU DEMO-) ne comptent pas : on attend un vrai produit.
  const realProductCount = Math.max(0, productCount - demoProducts.length);
  const hasLogo = !!(logoUrl || storeSettings?.logoUrl);
  const hasContact = !!(fullSettings?.contactPhone?.trim() || fullSettings?.contactWhatsapp?.trim());
  const pageSlugs = new Set(pages.filter((p) => p.published).map((p) => (p.slug || '').toLowerCase()));
  const hasLegal = [MENTIONS_PAGE_SLUG, TERMS_PAGE_SLUG, PRIVACY_PAGE_SLUG].every((slug) =>
    pageSlugs.has(slug),
  );
  // Chaque étape non faite peut être menée par l'assistant (parcours guidé) quand il est activé.
  const setupSteps: {
    done: boolean;
    label: string;
    href: string;
    icon: typeof Package;
    external?: boolean;
    assistant?: AssistantFlowId;
    onClick?: () => void;
  }[] = [
    {
      done: hasLogo,
      label: t('dashboard.setupLogo'),
      href: '/admin/parametres',
      icon: ImagePlus,
      assistant: 'basics',
    },
    {
      done: hasContact,
      label: t('dashboard.setupContact'),
      href: '/admin/parametres',
      icon: Phone,
      assistant: 'basics',
    },
    {
      done: realProductCount > 0,
      label: t('dashboard.setupRealProduct'),
      href: '/admin/produits?action=new',
      icon: Package,
      assistant: 'catalog',
    },
    {
      done: demoProducts.length === 0,
      label: t('dashboard.setupReplaceDemo', { count: demoProducts.length }),
      href: '/admin/onboarding?step=2',
      icon: Sparkles,
    },
    {
      done: (carriers?.length ?? 0) > 0,
      label: t('dashboard.setupShipping'),
      href: '/admin/livraison',
      icon: Truck,
      assistant: 'shipping',
    },
    {
      done: hasLegal,
      label: t('dashboard.setupLegal'),
      href: '/admin/onboarding?step=3',
      icon: FileText,
      assistant: 'legal',
    },
    {
      done: hasLogo && realProductCount > 0 && canViewPublic,
      label: t('dashboard.setupViewStore'),
      href: canViewPublic ? storefrontUrl : '/admin/onboarding',
      icon: ExternalLink,
      external: canViewPublic,
    },
    {
      done: shared,
      label: t('dashboard.setupShare'),
      href: whatsappShareUrl,
      icon: MessageCircle,
      external: true,
      onClick: markShared,
    },
  ];
  const doneSteps = setupSteps.filter((s) => s.done).length;
  const pendingSteps = setupSteps.length - doneSteps;
  const showOnboarding = pendingSteps > 0;

  const storeStatus = (storeSettings?.status || '').toUpperCase();
  // PENDING avec date d'essai = essai terminé (bannière TrialBanner) ; sinon activation manuelle.
  const pendingActivation = storeStatus === 'PENDING' && !store?.trialEndsAt;

  const quickActions = [
    { href: '/admin/produits?action=new', label: t('dashboard.qaNewProduct'), icon: Package },
    { href: '/admin/commandes', label: t('nav.orders'), icon: ShoppingCart },
    { href: '/admin/categories?action=new', label: t('dashboard.qaCategory'), icon: FolderOpen },
    { href: '/admin/boutique-en-ligne', label: t('nav.onlineStore'), icon: Store },
    { href: '/admin/stock', label: t('nav.stock'), icon: AlertTriangle },
    { href: '/admin/revenus', label: t('nav.revenue'), icon: TrendingUp },
  ];

  // Revenus en tête : c'est le chiffre qu'un marchand vient chercher en premier.
  const figures = [
    { title: t('dashboard.statRevenue'), value: formatPrice(dash?.deliveredRevenue ?? 0), subValue: t('dashboard.delivered12m'), href: '/admin/revenus', lead: true },
    { title: t('nav.orders'), value: dash?.orderCount ?? 0, subValue: t('dashboard.newOrdersCount', { count: dash?.newOrderCount ?? 0 }), href: '/admin/commandes' },
    { title: t('dashboard.statCustom'), value: dash?.customOrderCount ?? 0, subValue: t('dashboard.pendingCount', { count: dash?.pendingCustomOrderCount ?? 0 }), href: '/admin/personnalisations' },
    { title: t('dashboard.statProducts'), value: dash?.productCount ?? 0, href: '/admin/produits' },
  ];

  // Ce qui demande une action maintenant : n'apparaît que s'il y a quelque chose à traiter.
  const attention = [
    { n: dash?.newOrderCount ?? 0, label: t('dashboard.newOrdersCount', { count: dash?.newOrderCount ?? 0 }), href: '/admin/commandes', icon: ShoppingCart, tone: 'text-primary' },
    { n: dash?.pendingCustomOrderCount ?? 0, label: t('dashboard.pendingCount', { count: dash?.pendingCustomOrderCount ?? 0 }), href: '/admin/personnalisations', icon: Palette, tone: 'text-primary' },
    { n: dash?.lowStockCount ?? 0, label: `${t('dashboard.lowStock')} : ${dash?.lowStockCount ?? 0}`, href: '/admin/stock?filter=low', icon: AlertTriangle, tone: 'text-amber-600 dark:text-amber-400' },
    { n: dash?.outOfStockCount ?? 0, label: `${t('dashboard.outOfStock')} : ${dash?.outOfStockCount ?? 0}`, href: '/admin/stock?filter=out', icon: PackageX, tone: 'text-destructive' },
  ].filter((a) => a.n > 0);

  // À faire d'abord, fait ensuite ; la première étape à faire devient l'action mise en avant.
  const orderedSteps = [...setupSteps.filter((s) => !s.done), ...setupSteps.filter((s) => s.done)];
  const nextStep = orderedSteps.find((s) => !s.done);

  const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  const StepLink = ({ step, className, children }: { step: (typeof setupSteps)[number]; className: string; children: ReactNode }) =>
    step.external ? (
      <a href={step.href} target="_blank" rel="noopener noreferrer" onClick={step.onClick} className={className}>
        {children}
      </a>
    ) : (
      <Link to={step.href} className={className}>
        {children}
      </Link>
    );

  return (
    <AdminLayout
      title={t('dashboard.title')}
      description={
        siteName ? t('dashboard.welcome', { name: siteName }) : t('dashboard.description')
      }
      breadcrumbs={[{ label: t('dashboard.title') }]}
      actions={
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-1.5 sm:inline-flex"
          type="button"
          onClick={openStorefront}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t('dashboard.viewStorefront')}
        </Button>
      }
    >
      {storeSettings?.storefrontLive === false ? (
        <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
          <p className="font-display text-base font-semibold">{t('launch.title')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('launch.body')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`${storefrontUrl}${storefrontUrl.includes('?') ? '&' : '?'}preview=${storeSettings.previewKey ?? ''}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="me-1.5 h-3.5 w-3.5" />
                {t('launch.preview')}
              </a>
            </Button>
            <Button size="sm" disabled={launchStore.isPending} onClick={() => launchStore.mutate()}>
              {t('launch.action')}
            </Button>
          </div>
        </div>
      ) : null}
      {pendingActivation ? (
        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-50 p-4 dark:bg-amber-500/10 sm:p-5">
          <p className="font-display text-base font-semibold text-amber-950 dark:text-amber-200">
            {t('dashboard.pendingActivationTitle')}
          </p>
          <p className="mt-1 text-sm text-amber-900/80 dark:text-amber-200/80">
            {t('dashboard.pendingActivationBody')}
          </p>
        </div>
      ) : null}

      {showOnboarding ? (
        <section aria-labelledby="dash-setup" className="mb-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 p-5 pb-4 sm:p-6 sm:pb-4">
            <div>
              <h2 id="dash-setup" className="font-display text-lg font-semibold">{t('dashboard.setupTitle')}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{t('dashboard.setupRemaining', { count: pendingSteps })}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Un cran par étape : on voit combien il en reste sans lire un pourcentage. */}
              <div
                className="flex gap-1"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={setupSteps.length}
                aria-valuenow={doneSteps}
                aria-label={t('dashboard.setupProgress', { done: doneSteps, total: setupSteps.length })}
              >
                {setupSteps.map((s) => (
                  <span key={s.label} className={`h-2 w-4 rounded-full ${s.done ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {t('dashboard.setupProgress', { done: doneSteps, total: setupSteps.length })}
              </span>
            </div>
          </div>
          <ul className="divide-y divide-border border-t border-border">
            {orderedSteps.map((step) => {
              const featured = step === nextStep;
              return (
                <li
                  key={step.label}
                  className={`flex items-center gap-2 ${featured ? 'bg-primary/5' : ''}`}
                >
                  <StepLink
                    step={step}
                    className={`group flex min-h-11 min-w-0 flex-1 items-center gap-3 px-5 sm:px-6 ${featured ? 'py-4' : 'py-2.5'} ${FOCUS}`}
                  >
                    <span
                      className={`flex shrink-0 items-center justify-center rounded-full ${
                        step.done
                          ? 'h-6 w-6 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : featured
                            ? 'h-9 w-9 bg-primary text-primary-foreground'
                            : 'h-6 w-6 border border-border text-muted-foreground'
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 className="h-4 w-4" aria-hidden />
                      ) : (
                        <step.icon className={featured ? 'h-4 w-4' : 'h-3.5 w-3.5'} aria-hidden />
                      )}
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate ${
                        step.done
                          ? 'text-sm text-muted-foreground line-through decoration-muted-foreground/40'
                          : featured
                            ? 'text-base font-semibold'
                            : 'text-sm font-medium'
                      }`}
                    >
                      {step.label}
                    </span>
                    {!step.done ? (
                      <ArrowRight
                        className={`h-4 w-4 shrink-0 transition-transform rtl:rotate-180 motion-reduce:transition-none ${
                          featured ? 'text-primary' : 'text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                        }`}
                        aria-hidden
                      />
                    ) : null}
                  </StepLink>
                  {assistantStatus?.enabled && !step.done && step.assistant ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="me-4 shrink-0 gap-1 sm:me-5"
                      onClick={() => requestAssistantFlow(step.assistant as AssistantFlowId)}
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                      {t('dashboard.setupWithAssistant')}
                    </Button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <div className="mb-3 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        {figures.map((f) => (
          <Link
            key={f.title}
            to={f.href}
            className={`group bg-card p-5 transition-colors hover:bg-muted/40 ${FOCUS} focus-visible:ring-inset focus-visible:ring-offset-0`}
          >
            <p className="text-sm text-muted-foreground">{f.title}</p>
            <p className={`mt-1 font-display font-semibold tracking-tight ${f.lead ? 'text-4xl' : 'text-2xl'}`}>{f.value}</p>
            {f.subValue ? <p className="mt-1 text-xs text-muted-foreground">{f.subValue}</p> : null}
          </Link>
        ))}
      </div>

      {attention.length > 0 ? (
        <ul className="mb-3 flex flex-wrap gap-2">
          {attention.map((a) => (
            <li key={a.href}>
              <Link
                to={a.href}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-3.5 text-sm font-medium transition-colors hover:border-primary/50 sm:min-h-9 ${FOCUS}`}
              >
                <a.icon className={`h-4 w-4 ${a.tone}`} aria-hidden />
                {a.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <nav aria-label={t('dashboard.quickActions')} className="mb-8 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            to={action.href}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-md text-muted-foreground transition-colors hover:text-foreground sm:min-h-9 ${FOCUS}`}
          >
            <action.icon className="h-4 w-4" aria-hidden />
            {action.label}
          </Link>
        ))}
      </nav>

      {assistantStatus?.enabled ? <AiUsageCard /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="dash-orders" className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 px-5 pt-4 sm:px-6">
            <h2 id="dash-orders" className="font-display text-lg font-semibold">{t('dashboard.recentOrders')}</h2>
            <Link to="/admin/commandes" className={`rounded-md py-2 text-sm text-primary hover:underline ${FOCUS}`}>
              {t('dashboard.viewAll')}
            </Link>
          </div>
          {orders.length > 0 ? (
            <ul className="mt-2 divide-y divide-border">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    to="/admin/commandes"
                    className={`flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40 sm:px-6 ${FOCUS}`}
                  >
                    <span className="min-w-0">
                      <span className="block font-medium">{order.id}</span>
                      <span className="block truncate text-sm text-muted-foreground">{order.customer?.fullName}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-medium">{formatPrice(order.total ?? 0)}</span>
                      {getStatusBadge(order.status)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={ShoppingCart} title={t('dashboard.noOrders')} className="py-8" />
          )}
        </section>

        <section aria-labelledby="dash-custom" className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 px-5 pt-4 sm:px-6">
            <h2 id="dash-custom" className="font-display text-lg font-semibold">{t('dashboard.pendingCustomizations')}</h2>
            <Link to="/admin/personnalisations" className={`rounded-md py-2 text-sm text-primary hover:underline ${FOCUS}`}>
              {t('dashboard.viewAll')}
            </Link>
          </div>
          {customOrders.length > 0 ? (
            <ul className="mt-2 divide-y divide-border">
              {customOrders.map((request) => (
                <li key={request.id}>
                  <Link
                    to="/admin/personnalisations"
                    className={`flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40 sm:px-6 ${FOCUS}`}
                  >
                    {request.imageUrl ? (
                      <img src={getImageUrl(request.imageUrl)} alt={t('dashboard.modelAlt')} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Palette className="h-6 w-6 text-muted-foreground" aria-hidden />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{request.customer?.fullName}</span>
                      <span className="block truncate text-sm capitalize text-muted-foreground">
                        {request.type} - {request.style}
                      </span>
                    </span>
                    {getStatusBadge(request.status)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Palette} title={t('dashboard.noCustomRequests')} className="py-8" />
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
