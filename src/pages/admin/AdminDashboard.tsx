import { useQuery } from '@tanstack/react-query';
import {
  Package,
  ShoppingCart,
  Palette,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  PackageX,
  FolderOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Store,
  ImagePlus,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ordersApi } from '@/services/api/orders';
import { customOrdersApi } from '@/services/api/customOrders';
import { statsApi } from '@/services/api/stats';
import { platformApi } from '@/services/api/platform';
import { formatPrice } from '@/utils/formatPrice';
import { getImageUrl } from '@/services/api';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { buildStorefrontUrl } from '@/utils/storefrontUrl';
import { normalizeThemeKey } from '@/config/storeThemes';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { siteName, logoUrl, slug } = useStoreBrand();
  const storefrontUrl = buildStorefrontUrl(slug);

  useEffect(() => {
    const state = location.state as { onboarding?: boolean; pendingActivation?: boolean } | null;
    if (state?.onboarding) {
      toast.success(
        state.pendingActivation
          ? 'Boutique créée — en attente d’activation par Matjarona.'
          : 'Bienvenue ! Suivez la checklist pour lancer votre boutique.',
      );
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const { data: dash } = useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: () => statsApi.getDashboard(),
  });
  const { data: storeSettings } = useQuery({
    queryKey: ['store-settings', 'me', 'summary'],
    queryFn: () => platformApi.getMyStoreSummary(),
  });
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

  const stats = [
    {
      title: 'Total Produits',
      value: dash?.productCount ?? 0,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/produits',
    },
    {
      title: 'Commandes',
      value: dash?.orderCount ?? 0,
      subValue: `${dash?.newOrderCount ?? 0} nouvelles`,
      icon: ShoppingCart,
      color: 'bg-green-500',
      href: '/admin/commandes',
    },
    {
      title: 'Personnalisations',
      value: dash?.customOrderCount ?? 0,
      subValue: `${dash?.pendingCustomOrderCount ?? 0} en attente`,
      icon: Palette,
      color: 'bg-purple-500',
      href: '/admin/personnalisations',
    },
    {
      title: "Chiffre d'affaires",
      value: formatPrice(dash?.deliveredRevenue ?? 0),
      subValue: 'Livrées (12 mois)',
      icon: DollarSign,
      color: 'bg-primary',
      href: '/admin/revenus',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-yellow-100 text-yellow-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-orange-100 text-orange-800',
      contacted: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
    };
    const labels: Record<string, string> = {
      new: 'Nouvelle',
      confirmed: 'Confirmée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      pending: 'En attente',
      contacted: 'Contacté',
      completed: 'Terminée',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-body ${styles[status] ?? 'bg-muted text-muted-foreground'}`}>
        {labels[status] ?? status}
      </span>
    );
  };

  const productCount = dash?.productCount ?? 0;
  const hasLogo = !!(logoUrl || storeSettings?.logoUrl);
  const hasBranding =
    !!(storeSettings?.tagline?.trim() ||
      storeSettings?.primaryColor?.trim() ||
      storeSettings?.aboutText?.trim());
  const setupSteps = [
    {
      done: !!normalizeThemeKey(storeSettings?.themeKey),
      label: 'Choisir un thème',
      href: '/admin/onboarding',
      icon: Palette,
    },
    {
      done: hasLogo,
      label: 'Ajouter un logo',
      href: '/admin/parametres',
      icon: ImagePlus,
    },
    {
      done: hasBranding,
      label: 'Personnaliser l’apparence',
      href: '/admin/parametres',
      icon: Palette,
    },
    {
      done: productCount > 0,
      label: 'Ajouter un premier produit',
      href: '/admin/produits?action=new',
      icon: Package,
    },
    {
      done: productCount > 0 && hasLogo,
      label: 'Voir ma boutique en ligne',
      href: storefrontUrl,
      icon: ExternalLink,
      external: true,
    },
  ];
  const pendingSteps = setupSteps.filter((s) => !s.done).length;
  const showOnboarding = pendingSteps > 0;

  const storeStatus = (storeSettings?.status || '').toUpperCase();
  const pendingActivation = storeStatus === 'PENDING';

  const quickActions = [
    { href: '/admin/produits?action=new', label: 'Nouveau produit', icon: Package },
    { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
    { href: '/admin/categories?action=new', label: 'Catégorie', icon: FolderOpen },
    { href: '/admin/boutique-en-ligne', label: 'Boutique en ligne', icon: Store },
    { href: '/admin/stock', label: 'Stock', icon: AlertTriangle },
    { href: '/admin/revenus', label: 'Revenus', icon: TrendingUp },
  ];

  return (
    <AdminLayout
      title="Tableau de bord"
      description={siteName ? `Bienvenue sur ${siteName}` : 'Pilot d’ensemble de votre boutique'}
      breadcrumbs={[{ label: 'Tableau de bord' }]}
      actions={
        <Button variant="outline" size="sm" className="hidden gap-1.5 sm:inline-flex" asChild>
          <a href={storefrontUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            Voir la boutique
          </a>
        </Button>
      }
    >
      {pendingActivation ? (
        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-50 p-4 sm:p-5">
          <p className="font-display text-base font-semibold text-amber-950">
            Compte en attente d’activation
          </p>
          <p className="mt-1 text-sm text-amber-900/80">
            Un Super Admin Matjarona doit activer votre boutique avant qu’elle soit visible en ligne.
            Vous pouvez déjà préparer logo, design et produits.
          </p>
        </div>
      ) : null}
      {showOnboarding ? (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-white p-5 shadow-soft sm:p-6">
          <h2 className="font-display text-lg font-semibold">
            Démarrez votre boutique
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {pendingSteps} étape{pendingSteps > 1 ? 's' : ''} restante{pendingSteps > 1 ? 's' : ''} pour être prêt.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {setupSteps.map((step) => (
              <li key={step.label}>
                {step.external ? (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-[hsl(220_20%_98%)] px-4 py-3 transition hover:border-primary"
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <step.icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{step.label}</span>
                  </a>
                ) : (
                  <Link
                    to={step.href}
                    className="flex items-center gap-3 rounded-xl border border-border bg-[hsl(220_20%_98%)] px-4 py-3 transition hover:border-primary"
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <step.icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{step.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mb-8">
        <h2 className="mb-3 font-display text-base font-semibold">Actions rapides</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="group rounded-2xl border border-border/80 bg-white p-4 text-center shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <action.icon className="h-5 w-5" />
              </span>
              <p className="text-xs font-medium sm:text-sm">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="h-full border-border/80 bg-white shadow-soft transition hover:shadow-md">
            <div className="flex h-full flex-col justify-center gap-3 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  {stat.subValue ? (
                    <p className="mt-1 text-xs text-muted-foreground">{stat.subValue}</p>
                  ) : null}
                </div>
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5 text-white" aria-hidden />
                </div>
              </div>
              {stat.href ? (
                <Link
                  to={stat.href}
                  className="inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Voir tout →
                </Link>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/stock?filter=low" className="block h-full">
          <Card className="h-full transition-shadow hover:shadow-lg">
            <div className="flex h-full items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500">
                <AlertTriangle className="h-5 w-5 text-white" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Alertes stock bas</p>
                <p className="font-display text-xl font-semibold tracking-tight">
                  {dash?.lowStockCount ?? 0}
                </p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/admin/stock?filter=out" className="block h-full">
          <Card className="h-full transition-shadow hover:shadow-lg">
            <div className="flex h-full items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500">
                <PackageX className="h-5 w-5 text-white" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Ruptures</p>
                <p className="font-display text-xl font-semibold tracking-tight">
                  {dash?.outOfStockCount ?? 0}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-display text-lg">Commandes récentes</CardTitle>
            <Link to="/admin/commandes" className="font-body text-sm text-primary hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-body font-medium">{order.id}</p>
                    <p className="font-body text-sm text-muted-foreground">
                      {order.customer?.fullName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body font-medium">{formatPrice(order.total ?? 0)}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <EmptyState icon={ShoppingCart} title="Aucune commande" className="py-6" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-display text-lg">Personnalisations en attente</CardTitle>
            <Link to="/admin/personnalisations" className="font-body text-sm text-primary hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customOrders.length > 0 ? (
                customOrders.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    {request.imageUrl ? (
                      <img
                        src={getImageUrl(request.imageUrl)}
                        alt="Modèle"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Palette className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium truncate">
                        {request.customer?.fullName}
                      </p>
                      <p className="font-body text-sm text-muted-foreground capitalize">
                        {request.type} - {request.style}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                ))
              ) : (
                <EmptyState icon={Palette} title="Aucune demande en attente" className="py-6" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
