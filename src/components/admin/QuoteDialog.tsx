import { useState, useEffect } from 'react';
import { Send, FileText, Percent, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CustomOrderDTO } from '@/types/api';
import { toast } from 'sonner';
import { PUBLIC_SITE_NAME } from '@/config/site';
import { formatPrice } from '@/utils/formatPrice';

interface QuoteDialogProps {
  request: CustomOrderDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onQuoteSent: (requestId: string, quote: QuoteData) => void;
}

export interface QuoteData {
  id: string;
  requestId: string;
  /** Quantité (packs / unités) */
  quantity: number;
  unitPrice: number;
  customizationCost: number;
  extrasDescription: string;
  extrasCost: number;
  discount: number;
  totalPrice: number;
  validUntil: string;
  notes: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

const QuoteDialog = ({ request, isOpen, onClose, onQuoteSent }: QuoteDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [customizationCost, setCustomizationCost] = useState(0);
  const [extrasDescription, setExtrasDescription] = useState('');
  const [extrasCost, setExtrasCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [validDays, setValidDays] = useState(7);
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendMode, setSendMode] = useState<'whatsapp' | 'email' | 'both'>('both');

  useEffect(() => {
    if (request) {
      setQuantity(request.weight && request.weight > 0 ? request.weight : 1);
      setUnitPrice(0);
      setCustomizationCost(0);
      setExtrasDescription('');
      setExtrasCost(0);
      setDiscount(0);
      setValidDays(7);
      setNotes('');
    }
  }, [request]);

  const lineTotal = quantity * unitPrice;
  const subtotal = lineTotal + customizationCost + extrasCost;
  const discountAmount = (subtotal * discount) / 100;
  const totalPrice = Math.max(0, subtotal - discountAmount);

  const handleSendQuote = async () => {
    if (!request) return;

    if (quantity <= 0) {
      toast.error('Veuillez indiquer une quantité valide');
      return;
    }
    if (unitPrice <= 0 && customizationCost <= 0 && extrasCost <= 0) {
      toast.error('Indiquez au moins un prix unitaire ou un coût');
      return;
    }
    if (totalPrice <= 0) {
      toast.error('Le prix total doit être supérieur à 0');
      return;
    }

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    const quote: QuoteData = {
      id: `DEV-${Date.now()}`,
      requestId: request.id,
      quantity,
      unitPrice,
      customizationCost,
      extrasDescription,
      extrasCost,
      discount,
      totalPrice,
      validUntil: validUntil.toISOString(),
      notes,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    const detailLines = [
      `Quantité : ${quantity}`,
      unitPrice > 0 ? `Prix unitaire : ${formatPrice(unitPrice)}` : null,
      customizationCost > 0 ? `Personnalisation : ${formatPrice(customizationCost)}` : null,
      extrasCost > 0 ? `Extras (${extrasDescription || '—'}) : ${formatPrice(extrasCost)}` : null,
      discount > 0 ? `Remise : ${discount}%` : null,
    ]
      .filter(Boolean)
      .join('\n');

    if (sendMode === 'whatsapp' || sendMode === 'both') {
      const message = encodeURIComponent(
        `🔹 *DEVIS ${quote.id}* — ${PUBLIC_SITE_NAME} 🔹\n\n` +
          `👤 *Client*: ${request.customer.fullName}\n` +
          `📞 *Téléphone*: ${request.customer.phone}\n` +
          (request.customer.email ? `📧 *Email*: ${request.customer.email}\n` : '') +
          `\n📦 *Détail*\n${detailLines}\n\n` +
          `💰 *Total*: ${formatPrice(totalPrice)}\n` +
          `⏰ *Validité*: ${validUntil.toLocaleDateString('fr-FR')}\n\n` +
          `📝 *Notes*: ${notes || 'Aucune'}\n\n` +
          `Pour confirmer, répondez à ce message.`
      );
      const phone = request.customer.phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
      toast.success('Message WhatsApp ouvert');
    }

    if ((sendMode === 'email' || sendMode === 'both') && request.customer.email) {
      const subject = encodeURIComponent(`Devis ${quote.id} - ${request.customer.fullName}`);
      const body = encodeURIComponent(
        `Cher/Chère ${request.customer.fullName},\n\n` +
          `Veuillez trouver ci-dessous votre devis ${PUBLIC_SITE_NAME} :\n\n` +
          `Devis: ${quote.id}\n${detailLines}\n\n` +
          `Total: ${formatPrice(totalPrice)}\n` +
          `Validité: ${validUntil.toLocaleDateString('fr-FR')}\n\n` +
          `Notes: ${notes || 'Aucune'}\n\n` +
          `Cordialement,\nL'équipe ${PUBLIC_SITE_NAME}`
      );
      window.open(`mailto:${request.customer.email}?subject=${subject}&body=${body}`, '_blank');
      toast.success('Client email ouvert');
    } else if (sendMode === 'email' && !request.customer.email) {
      toast.error('Aucun email client — utilisez WhatsApp');
    }

    if (sendMode === 'both') {
      toast.success('Devis prêt à envoyer');
    }

    onQuoteSent(request.id, quote);
    setIsSending(false);
    onClose();
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Créer un devis — {request.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3 gap-3">
              <div className="min-w-0">
                <p className="font-body font-medium text-lg truncate">{request.customer.fullName}</p>
                {request.customer.email && (
                  <p className="font-body text-sm text-muted-foreground truncate">{request.customer.email}</p>
                )}
                <p className="font-body text-sm text-muted-foreground">{request.customer.phone}</p>
                {(request.type || request.style) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {[request.type, request.style, request.size].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant={sendMode === 'whatsapp' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSendMode('whatsapp')}
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
                <Button
                  variant={sendMode === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSendMode('email')}
                  className="flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  <span className="hidden sm:inline">Email</span>
                </Button>
                <Button
                  variant={sendMode === 'both' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSendMode('both')}
                  className="flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span className="hidden sm:inline">Les deux</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body">Quantité (packs / unités)</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                min={1}
                step={1}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="font-body">Prix unitaire (DH)</Label>
              <Input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                min={0}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <div className="bg-primary/10 rounded-lg p-3">
                <p className="font-body text-xs text-muted-foreground">Ligne produit</p>
                <p className="font-display text-lg">{formatPrice(lineTotal)}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body">Personnalisation / façonnage (DH)</Label>
              <Input
                type="number"
                value={customizationCost}
                onChange={(e) => setCustomizationCost(parseFloat(e.target.value) || 0)}
                min={0}
                placeholder="Logo, cliché, setup…"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="font-body">Extras — coût (DH)</Label>
              <Input
                type="number"
                value={extrasCost}
                onChange={(e) => setExtrasCost(parseFloat(e.target.value) || 0)}
                min={0}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="font-body">Extras — description</Label>
              <Input
                value={extrasDescription}
                onChange={(e) => setExtrasDescription(e.target.value)}
                placeholder="Ex: livraison express, échantillons…"
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Remise (%)
              </Label>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                min={0}
                max={100}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="font-body">Validité du devis (jours)</Label>
              <Select value={validDays.toString()} onValueChange={(v) => setValidDays(parseInt(v, 10))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 jours</SelectItem>
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="14">14 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="font-body">Notes / Conditions</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Délai de production, acompte, conditions…"
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="bg-charcoal text-cream rounded-lg p-4 space-y-2">
            <div className="flex justify-between font-body text-sm">
              <span>
                Produit ({quantity} × {formatPrice(unitPrice)})
              </span>
              <span>{formatPrice(lineTotal)}</span>
            </div>
            {customizationCost > 0 && (
              <div className="flex justify-between font-body text-sm">
                <span>Personnalisation</span>
                <span>{formatPrice(customizationCost)}</span>
              </div>
            )}
            {extrasCost > 0 && (
              <div className="flex justify-between font-body text-sm">
                <span>Extras</span>
                <span>{formatPrice(extrasCost)}</span>
              </div>
            )}
            <Separator className="bg-cream/20" />
            <div className="flex justify-between font-body text-sm">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-body text-sm text-green-400">
                <span>Remise ({discount}%)</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <Separator className="bg-cream/20" />
            <div className="flex justify-between font-display text-xl">
              <span>TOTAL</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSendQuote}
            disabled={isSending || quantity <= 0}
            className="bg-primary text-primary-foreground"
          >
            {isSending ? (
              'Envoi en cours...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {sendMode === 'whatsapp'
                  ? 'Envoyer par WhatsApp'
                  : sendMode === 'email'
                    ? 'Envoyer par Email'
                    : 'Envoyer WhatsApp + Email'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
