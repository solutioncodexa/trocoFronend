import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Search, Phone, MapPin } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ordersApi } from '@/services/api/orders';
import { OrderDTO } from '@/types/api';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getAllOrders(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Statut mis à jour');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {['new', 'confirmed', 'delivered', 'cancelled'].map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <div key={status} className="bg-card rounded-lg p-4 border border-border">
              <Badge className={cn('mb-2', getStatusStyle(status))}>
                {getStatusLabel(status)}
              </Badge>
              <p className="font-display text-2xl">{count}</p>
            </div>
          );
        })}
      </div>

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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
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

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Ville</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-right font-body text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-body font-medium">{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-body">{order.customer?.fullName}</p>
                    <p className="font-body text-xs text-muted-foreground">{order.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-muted-foreground">{order.customer?.city ?? '—'}</td>
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

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center">
            <p className="font-body text-muted-foreground">Aucune commande trouvée</p>
          </div>
        )}
      </div>

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
                        src={item.product?.images?.[0]}
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
