import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { auditApi } from '@/services/api/audit';
import { membersApi } from '@/services/api/members';
import { EmptyState } from '@/components/ui/EmptyState';
import { History } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

const ACTION_LABELS: Record<string, string> = {
  PRODUCT_CREATE: 'Création produit',
  PRODUCT_UPDATE: 'Modification produit',
  PRODUCT_DELETE: 'Suppression produit',
  STOCK_ADJUST: 'Ajustement stock',
  ORDER_UPDATE_STATUS: 'Statut commande',
  ORDER_DELETE: 'Suppression commande',
  MEMBER_CREATE: 'Création membre',
  MEMBER_UPDATE: 'Modification membre',
  MEMBER_ACTIVATE: 'Activation membre',
  MEMBER_DEACTIVATE: 'Désactivation membre',
  MEMBER_PASSWORD_RESET: 'Reset mot de passe',
  MEMBER_DELETE: 'Suppression membre',
  ADMIN_LOGIN: 'Connexion admin',
  LOGIN: 'Connexion',
};

const AdminAudit = () => {
  const { isAdmin } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdParam = searchParams.get('userId');
  const [page, setPage] = useState(0);
  const [action, setAction] = useState('all');
  const [entity, setEntity] = useState('all');
  const [userId, setUserId] = useState(userIdParam || 'all');

  const { data: members = [] } = useQuery({
    queryKey: ['admin', 'members'],
    queryFn: () => membersApi.list(),
    enabled: isAdmin,
  });

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['admin', 'audit', page, action, entity, userId],
    queryFn: () =>
      auditApi.search({
        page,
        size: 20,
        action: action === 'all' ? undefined : action,
        entity: entity === 'all' ? undefined : entity,
        userId: userId === 'all' ? undefined : Number(userId),
      }),
  });

  return (
    <AdminLayout title="Audit" breadcrumbs={[{ label: 'Équipe' }, { label: 'Audit' }]}>
      <p className="text-sm text-muted-foreground mb-4">
        Historique des actions : produits, stock (achat / vente directe), commandes, membres…
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        {isAdmin && (
          <Select
            value={userId}
            onValueChange={(v) => {
              setUserId(v);
              setPage(0);
              if (v === 'all') {
                searchParams.delete('userId');
              } else {
                searchParams.set('userId', v);
              }
              setSearchParams(searchParams);
            }}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Personne" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les personnes</SelectItem>
              {members.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.fullName || m.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select
          value={action}
          onValueChange={(v) => {
            setAction(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les actions</SelectItem>
            {Object.keys(ACTION_LABELS).map((a) => (
              <SelectItem key={a} value={a}>
                {ACTION_LABELS[a]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={entity}
          onValueChange={(v) => {
            setEntity(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Entité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les entités</SelectItem>
            <SelectItem value="PRODUCT">Produit</SelectItem>
            <SelectItem value="STOCK">Stock</SelectItem>
            <SelectItem value="ORDER">Commande</SelectItem>
            <SelectItem value="USER">Membre</SelectItem>
            <SelectItem value="AUTH">Auth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : (
        <>
          {(pageData?.content ?? []).length === 0 && (
            <EmptyState icon={History} title="Aucune entrée d'audit" />
          )}
          <div className="space-y-2">
            {(pageData?.content ?? []).map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-border bg-card p-3 flex flex-wrap justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{ACTION_LABELS[row.action] || row.action}</Badge>
                    {row.entityName ? <Badge variant="secondary">{row.entityName}</Badge> : null}
                    <span className="text-sm font-medium">
                      {row.userFullName || row.username || '—'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {row.description || '—'}
                    {row.entityId ? ` · #${row.entityId}` : ''}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0">
                  <div>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : ''}
                  </div>
                  <div>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {pageData && pageData.totalPages > 0 && (
            <div className="mt-4">
              <AdminPagination
                page={page}
                totalPages={pageData.totalPages}
                totalElements={pageData.totalElements}
                size={20}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminAudit;
