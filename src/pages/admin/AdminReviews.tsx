import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, MessageSquareQuote, Star, Trash2, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { productReviewsApi } from '@/services/api/productReviews';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const AdminReviews = () => {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-product-reviews'],
    queryFn: () => productReviewsApi.listAdmin(),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, approved }: { id: number; approved: boolean }) =>
      productReviewsApi.setApproved(id, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product-reviews'] });
      toast.success('Avis mis à jour');
    },
    onError: (err: unknown) => toastError(err, 'Action impossible'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productReviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product-reviews'] });
      toast.success('Avis supprimé');
    },
    onError: (err: unknown) => toastError(err, 'Suppression impossible'),
  });

  return (
    <AdminLayout
      title="Avis produits"
      breadcrumbs={[{ label: 'Avis' }]}
      description="Modérez les avis clients avant publication sur la fiche produit."
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="Aucun avis"
          description="Les avis soumis sur les fiches produits apparaîtront ici pour validation."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Produit</th>
                <th className="px-3 py-2 font-medium">Auteur</th>
                <th className="px-3 py-2 font-medium">Note</th>
                <th className="px-3 py-2 font-medium">Statut</th>
                <th className="px-3 py-2 font-medium">Avis</th>
                <th className="px-3 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString('fr-MA') : '—'}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">#{r.productId}</td>
                  <td className="px-3 py-2">{r.authorName}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {r.rating}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {r.approved ? (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600">Publié</Badge>
                    ) : (
                      <Badge variant="outline">En attente</Badge>
                    )}
                  </td>
                  <td className="max-w-xs px-3 py-2">
                    {r.title ? <p className="font-medium">{r.title}</p> : null}
                    <p className="text-muted-foreground line-clamp-3">{r.body}</p>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      {!r.approved ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          disabled={approveMutation.isPending}
                          onClick={() => approveMutation.mutate({ id: r.id, approved: true })}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approuver
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={approveMutation.isPending}
                          onClick={() => approveMutation.mutate({ id: r.id, approved: false })}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (window.confirm('Supprimer cet avis ?')) deleteMutation.mutate(r.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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

export default AdminReviews;
