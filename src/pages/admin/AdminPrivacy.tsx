import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Download, Eraser, Shield } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { privacyApi } from '@/services/api/privacy';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const AdminPrivacy = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eraseOpen, setEraseOpen] = useState(false);

  const exportMutation = useMutation({
    mutationFn: () => privacyApi.exportSubject({ email, phone }),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-donnees-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export JSON téléchargé');
    },
    onError: (e) => toastError(e, 'Export impossible'),
  });

  const eraseMutation = useMutation({
    mutationFn: () => privacyApi.eraseSubject({ email, phone }),
    onSuccess: () => {
      toast.success('Données effacées pour le sujet indiqué');
      setEraseOpen(false);
    },
    onError: (e) => toastError(e, 'Effacement impossible'),
  });

  const canAct = email.trim().length > 0 || phone.trim().length > 0;

  return (
    <AdminLayout
      title="Conformité & données personnelles"
      breadcrumbs={[{ label: 'Conformité' }]}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-start gap-3">
          <Shield className="mt-1 h-8 w-8 text-primary shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">Conformité CNDP</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Export ou effacement des données liées à un client (email ou téléphone).
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="privacy-email">Email</Label>
              <Input
                id="privacy-email"
                type="email"
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@exemple.ma"
              />
            </div>
            <div>
              <Label htmlFor="privacy-phone">Téléphone</Label>
              <Input
                id="privacy-phone"
                className="mt-1.5"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+2126…"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Renseignez au moins l&apos;email ou le téléphone.</p>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="gap-2"
              disabled={!canAct || exportMutation.isPending}
              onClick={() => exportMutation.mutate()}
            >
              <Download className="h-4 w-4" />
              Exporter (JSON)
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="gap-2"
              disabled={!canAct || eraseMutation.isPending}
              onClick={() => setEraseOpen(true)}
            >
              <Eraser className="h-4 w-4" />
              Effacer le sujet
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={eraseOpen} onOpenChange={setEraseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l&apos;effacement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprime les données personnelles associées à ce sujet (commandes anonymisées,
              fidélité, paniers, etc.). Action irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => eraseMutation.mutate()}
            >
              Effacer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPrivacy;
