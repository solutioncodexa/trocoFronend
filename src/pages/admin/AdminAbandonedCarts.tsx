import { useQuery } from '@tanstack/react-query';
import { TimerReset } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { abandonedCartsApi } from '@/services/api/abandonedCarts';
import { formatPrice } from '@/utils/formatPrice';

const AdminAbandonedCarts = () => {
  const { data: carts = [], isLoading } = useQuery({
    queryKey: ['admin-abandoned-carts'],
    queryFn: () => abandonedCartsApi.listAdmin(),
  });

  return (
    <AdminLayout
      title="Paniers abandonnés"
      breadcrumbs={[{ label: 'Paniers abandonnés' }]}
      description="Paniers capturés depuis la vitrine avec relance email (si activée)."
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : carts.length === 0 ? (
        <EmptyState
          icon={TimerReset}
          title="Aucun panier abandonné"
          description="Les paniers capturés au checkout (email ou téléphone) apparaîtront ici pour relance."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Dernière activité</th>
                <th className="px-3 py-2 font-medium">Client</th>
                <th className="px-3 py-2 font-medium">Contact</th>
                <th className="px-3 py-2 font-medium">Articles</th>
                <th className="px-3 py-2 font-medium">Total</th>
                <th className="px-3 py-2 font-medium">Relance</th>
                <th className="px-3 py-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((c) => (
                <tr key={c.id} className="border-t border-border align-top">
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                    {c.lastActivityAt
                      ? new Date(c.lastActivityAt).toLocaleString('fr-MA')
                      : c.createdAt
                        ? new Date(c.createdAt).toLocaleString('fr-MA')
                        : '—'}
                  </td>
                  <td className="px-3 py-2">{c.customerName || '—'}</td>
                  <td className="px-3 py-2 text-xs">
                    {c.customerEmail ? <p>{c.customerEmail}</p> : null}
                    {c.customerPhone ? <p className="text-muted-foreground">{c.customerPhone}</p> : null}
                    {!c.customerEmail && !c.customerPhone ? '—' : null}
                  </td>
                  <td className="px-3 py-2">{c.itemCount}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {c.cartTotal != null ? formatPrice(Number(c.cartTotal)) : '—'}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {c.reminderSent ? (
                      <Badge variant="secondary">Envoyée</Badge>
                    ) : c.remindAt ? (
                      <span>Prévue {new Date(c.remindAt).toLocaleString('fr-MA')}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {c.recovered ? (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600">Récupéré</Badge>
                    ) : (
                      <Badge variant="outline">Abandonné</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAbandonedCarts;
