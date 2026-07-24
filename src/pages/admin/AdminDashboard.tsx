import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, Palette, DollarSign, TrendingUp, AlertTriangle, PackageX, Star, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ordersApi } from '@/services/api/orders';
import { customOrdersApi } from '@/services/api/customOrders';
import { statsApi } from '@/services/api/stats';
import { formatPrice } from '@/utils/formatPrice';
import { getImageUrl } from '@/services/api';
import { EmptyState } from '@/components/ui/EmptyState';

const AdminDashboard = () => {
  const { data: dash } = useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: () => statsApi.getDashboard(),
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

  return (
    <AdminLayout title="Tableau de bord" breadcrumbs={[{ label: 'Tableau de bord' }]}>
      <div className="mb-8">
        <h2 className="font-display text-lg mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Link
            to="/admin/categories?action=new"
            className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <FolderOpen className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-body font-medium">Créer une catégorie</p>
          </Link>
          <Link
            to="/admin/produits?action=new"
            className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <Package className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-body font-medium">Ajouter un produit</p>
          </Link>
          <Link
            to="/admin/commandes"
            className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <ShoppingCart className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-body font-medium">Gérer les commandes</p>
          </Link>
          <Link
            to="/admin/produits-selectionnes"
            className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <Star className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-body font-medium">Produits sélectionnés</p>
          </Link>
          <Link
            to="/admin/stock"
            className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <AlertTriangle className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-body font-medium">Gérer le stock</p>
          </Link>
          <Link
            to="/admin/revenus"
            className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <TrendingUp className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-body font-medium">Voir les revenus</p>
          </Link>
        </div>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="h-full transition-shadow hover:shadow-lg">
            <div className="flex h-full flex-col justify-center gap-3 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  {stat.subValue ? (
                    <p className="mt-1 font-body text-xs text-muted-foreground">{stat.subValue}</p>
                  ) : null}
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6 text-white" aria-hidden />
                </div>
              </div>
              {stat.href ? (
                <Link
                  to={stat.href}
                  className="inline-flex font-body text-sm font-medium text-primary hover:underline"
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
