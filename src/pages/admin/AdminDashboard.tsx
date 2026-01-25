import { Package, ShoppingCart, Palette, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/data/products';
import { mockOrders, mockCustomRequests } from '@/data/adminMockData';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Produits',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/produits',
    },
    {
      title: 'Commandes',
      value: mockOrders.length,
      subValue: `${mockOrders.filter(o => o.status === 'new').length} nouvelles`,
      icon: ShoppingCart,
      color: 'bg-green-500',
      href: '/admin/commandes',
    },
    {
      title: 'Personnalisations',
      value: mockCustomRequests.length,
      subValue: `${mockCustomRequests.filter(r => r.status === 'pending').length} en attente`,
      icon: Palette,
      color: 'bg-purple-500',
      href: '/admin/personnalisations',
    },
    {
      title: 'Chiffre d\'affaires',
      value: '101,400 MAD',
      subValue: 'Ce mois',
      icon: DollarSign,
      color: 'bg-primary',
    },
  ];

  const recentOrders = mockOrders.slice(0, 5);
  const pendingRequests = mockCustomRequests.filter(r => r.status === 'pending');

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-yellow-100 text-yellow-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-orange-100 text-orange-800',
      contacted: 'bg-purple-100 text-purple-800',
    };
    const labels: Record<string, string> = {
      new: 'Nouvelle',
      confirmed: 'Confirmée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      pending: 'En attente',
      contacted: 'Contacté',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-body ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <AdminLayout title="Tableau de bord" breadcrumbs={[{ label: 'Tableau de bord' }]}>
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-muted-foreground">{stat.title}</p>
                  <p className="font-display text-2xl mt-1">{stat.value}</p>
                  {stat.subValue && (
                    <p className="font-body text-xs text-muted-foreground mt-1">{stat.subValue}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              {stat.href && (
                <Link
                  to={stat.href}
                  className="block mt-4 font-body text-sm text-primary hover:underline"
                >
                  Voir tout →
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Commandes récentes</CardTitle>
            <Link to="/admin/commandes" className="font-body text-sm text-primary hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-body font-medium">{order.id}</p>
                    <p className="font-body text-sm text-muted-foreground">
                      {order.customer.fullName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body font-medium">{order.total.toLocaleString()} MAD</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Custom Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Personnalisations en attente</CardTitle>
            <Link to="/admin/personnalisations" className="font-body text-sm text-primary hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <img
                      src={request.imageUrl}
                      alt="Modèle"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium truncate">
                        {request.customer.fullName}
                      </p>
                      <p className="font-body text-sm text-muted-foreground capitalize">
                        {request.type} - {request.style}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                ))
              ) : (
                <p className="font-body text-muted-foreground text-center py-4">
                  Aucune demande en attente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="font-display text-lg mb-4">Actions rapides</h2>
        <div className="grid sm:grid-cols-3 gap-4">
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
            to="/admin/categories"
            className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <TrendingUp className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-body font-medium">Gérer les catégories</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
