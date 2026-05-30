import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Search, Phone, MapPin } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ordersApi, getImageUrl } from '@/services/api';
import { OrderDTO } from '@/types/api';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { cn } from '@/lib/utils';

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdParam = searchParams.get('order');
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterStatusChange = useCallback((status: string) => {
    setFilterStatus(status);
    setPage(0);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(0);
  }, []);

  const { data: ordersPage, isLoading } = useQuery({
    queryKey: ['orders', 'page', page, pageSize, filterStatus, debouncedSearch],
    queryFn: () => ordersApi.getAllOrders({
      page,
      size: pageSize,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      keyword: debouncedSearch || undefined,
    }),
  });

  const orders = ordersPage?.content ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Statut mis à jour');
    },
    onError: (err: Error) => toastError(err, 'Erreur lors de la mise à jour du statut'),
  });

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status] ?? '';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Nouvelle',
      confirmed: 'Confirmée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return labels[status] ?? status;
  };

  const handleViewOrder = (order: OrderDTO) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  useEffect(() => {
    if (!orderIdParam) return;
    const order = orders.find((o) => String(o.id) === orderIdParam);
    if (order) {
      setSelectedOrder(order);
      setIsDetailOpen(true);
      setSearchParams({}, { replace: true });
    } else {
      ordersApi.getOrderById(orderIdParam)
        .then((o) => {
          setSelectedOrder(o);
          setIsDetailOpen(true);
          setSearchParams({}, { replace: true });
        })
        .catch(() => {});
    }
  }, [orderIdParam, orders, setSearchParams]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des Commandes" breadcrumbs={[{ label: 'Commandes' }]}>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Commandes" breadcrumbs={[{ label: 'Commandes' }]}>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <span className="font-medium text-foreground">{ordersPage?.totalElements ?? 0}</span>
        commande{(ordersPage?.totalElements ?? 0) > 1 ? 's' : ''}
        {filterStatus !== 'all' && (
          <>· filtre <Badge className={cn('text-[10px] px-1.5 py-0', getStatusStyle(filterStatus))}>{getStatusLabel(filterStatus)}</Badge></>
        )}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher par ID, nom ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="new">Nouvelles</SelectItem>
            <SelectItem value="confirmed">Confirmées</SelectItem>
            <SelectItem value="delivered">Livrées</SelectItem>
            <SelectItem value="cancelled">Annulées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile: card layout */}
      <div className="block lg:hidden space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-card rounded-lg border border-border p-3 sm:p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-body font-medium text-sm">{order.customer?.fullName}</p>
                <p className="font-body text-xs text-muted-foreground">{order.customer?.phone}</p>
                <p className="font-body text-xs text-muted-foreground">{order.customer?.city ?? '—'}</p>
              </div>
              <Badge className={cn('shrink-0 text-[10px]', getStatusStyle(order.status))}>
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            {order.items && order.items.length > 0 && (
              <div className="flex items-center gap-2">
                {order.items[0].product?.images?.[0] ? (
                  <img
                    src={getImageUrl(order.items[0].product.images[0])}
                    alt={order.items[0].product?.name}
                    className="w-10 h-10 rounded object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0">
                    <span className="text-xs text-muted-foreground">—</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm truncate">{order.items[0].product?.name}</p>
                  {order.items.length > 1 && (
                    <p className="font-body text-xs text-muted-foreground">+{order.items.length - 1} article(s)</p>
                  )}
                </div>
                <p className="font-body font-medium text-sm shrink-0">{formatPrice(order.total ?? 0)}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Select
                value={order.status}
                onValueChange={(value) => handleStatusChange(order.id, value)}
              >
                <SelectTrigger className={cn('flex-1 h-8 text-xs', getStatusStyle(order.status))}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nouvelle</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="delivered">Livrée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleViewOrder(order)}>
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
            </div>
            <p className="font-body text-[10px] text-muted-foreground">
              {order.createdAt ? formatDate(order.createdAt) : '—'}
            </p>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="p-8 text-center">
            <p className="font-body text-muted-foreground">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden lg:block bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Ville</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Produit</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-right font-body text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-body font-medium">{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-body">{order.customer?.fullName}</p>
                    <p className="font-body text-xs text-muted-foreground">{order.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-muted-foreground">{order.customer?.city ?? '—'}</td>
                  <td className="px-4 py-3">
                    {order.items && order.items.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {order.items[0].product?.images?.[0] ? (
                          <img
                            src={getImageUrl(order.items[0].product.images[0])}
                            alt={order.items[0].product?.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">—</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm truncate">{order.items[0].product?.name}</p>
                          {order.items.length > 1 && (
                            <p className="font-body text-xs text-muted-foreground">+{order.items.length - 1} article(s)</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="font-body text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-body font-medium">{formatPrice(order.total ?? 0)}</td>
                  <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                    {order.createdAt ? formatDate(order.createdAt) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className={cn('w-32', getStatusStyle(order.status))}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nouvelle</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-8 text-center">
            <p className="font-body text-muted-foreground">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {ordersPage && ordersPage.totalPages > 1 && (
        <AdminPagination
          page={page}
          totalPages={ordersPage.totalPages}
          totalElements={ordersPage.totalElements}
          size={pageSize}
          onPageChange={setPage}
          onSizeChange={handlePageSizeChange}
        />
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Commande {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={cn('text-sm', getStatusStyle(selectedOrder.status))}>
                  {getStatusLabel(selectedOrder.status)}
                </Badge>
                <span className="font-body text-sm text-muted-foreground">
                  {selectedOrder.createdAt ? formatDate(selectedOrder.createdAt) : '—'}
                </span>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-display text-lg">Informations client</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-body">{selectedOrder.customer?.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`tel:${selectedOrder.customer?.phone}`}
                      className="font-body text-primary hover:underline"
                    >
                      {selectedOrder.customer?.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="font-body">
                      {selectedOrder.customer?.address ?? '—'}, {selectedOrder.customer?.city ?? '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-lg mb-4">Articles commandés</h3>
                <div className="space-y-3">
                  {(selectedOrder.items ?? []).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                    >
                      <img
                        src={getImageUrl(item.product?.images?.[0])}
                        alt={item.product?.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-body font-medium">{item.product?.name}</p>
                        <p className="font-body text-sm text-muted-foreground">
                          {item.product?.weight}g • Qté: {item.quantity}
                        </p>
                      </div>
                      <p className="font-body font-medium">
                        {formatPrice((item.product?.price ?? 0) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-display text-2xl text-primary">
                    {formatPrice(selectedOrder.total ?? 0)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Changer le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nouvelle</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
