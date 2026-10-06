import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { marketApi } from '@/services/api/market';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const ReturnRequest = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      await marketApi.requestReturn({ orderNumber, phone, reason });
      setSent(true);
      toast.success('Demande de retour envoyée');
    } catch (err) {
      toastError(err, 'Demande refusée');
    } finally {
      setPending(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-lg px-4 py-12">
        <h1 className="mb-2 text-2xl font-semibold">Retour et remboursement</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Indiquez le numéro de commande et le téléphone utilisé à la commande.
        </p>
        {sent ? (
          <p className="rounded-lg border border-border bg-card p-4 text-sm">
            Votre demande est enregistrée. La boutique vous répondra pour le remboursement.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <Label htmlFor="orderNumber">Numéro de commande</Label>
              <Input id="orderNumber" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="06… ou +212…" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="reason">Motif</Label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={4}
              />
            </div>
            <Button type="submit" disabled={pending}>Envoyer la demande</Button>
          </form>
        )}
        <Link to="/" className="mt-6 inline-block text-sm text-primary underline">Retour à la boutique</Link>
      </div>
    </Layout>
  );
};

export default ReturnRequest;
