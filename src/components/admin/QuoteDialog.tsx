import { useState, useEffect } from 'react';
import { Calculator, Send, FileText, Percent, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { GoldType } from '@/types/product';
import { CustomOrderDTO } from '@/types/api';
import { useGoldTypes } from '@/hooks/useGoldTypes';
import { toast } from 'sonner';

interface QuoteDialogProps {
  request: CustomOrderDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onQuoteSent: (requestId: string, quote: QuoteData) => void;
}

export interface QuoteData {
  id: string;
  requestId: string;
  goldType: GoldType;
  weight: number;
  goldPricePerGram: number;
  laborCost: number;
  stonesDescription: string;
  stonesCost: number;
  discount: number;
  totalPrice: number;
  validUntil: string;
  notes: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

// Prix de l'or par gramme (en MAD) - valeurs indicatives
const DEFAULT_GOLD_PRICES: Record<GoldType, number> = {
  yellow: 650,
  white: 680,
  rose: 660,
};

const QuoteDialog = ({ request, isOpen, onClose, onQuoteSent }: QuoteDialogProps) => {
  const { goldTypeLabels } = useGoldTypes();
  const [goldType, setGoldType] = useState<GoldType>('yellow');
  const [weight, setWeight] = useState<number>(0);
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(DEFAULT_GOLD_PRICES.yellow);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [stonesDescription, setStonesDescription] = useState<string>('');
  const [stonesCost, setStonesCost] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [validDays, setValidDays] = useState<number>(7);
  const [notes, setNotes] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [sendMode, setSendMode] = useState<'whatsapp' | 'email' | 'both'>('both');

  // Reset form when request changes
  useEffect(() => {
    if (request) {
      setWeight(request.weight || 0);
      setGoldType('yellow');
      setGoldPricePerGram(DEFAULT_GOLD_PRICES.yellow);
      setLaborCost(0);
      setStonesDescription('');
      setStonesCost(0);
      setDiscount(0);
      setValidDays(7);
      setNotes('');
    }
  }, [request]);

  // Update gold price when type changes
  useEffect(() => {
    setGoldPricePerGram(DEFAULT_GOLD_PRICES[goldType]);
  }, [goldType]);

  // Calculate totals
  const goldCost = weight * goldPricePerGram;
  const subtotal = goldCost + laborCost + stonesCost;
  const discountAmount = (subtotal * discount) / 100;
  const totalPrice = subtotal - discountAmount;

  const handleSendQuote = async () => {
    if (!request) return;
    
    if (weight <= 0) {
      toast.error('Veuillez spécifier un poids valide');
      return;
    }

    if (totalPrice <= 0) {
      toast.error('Le prix total doit être supérieur à 0');
      return;
    }

    setIsSending(true);

    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    const quote: QuoteData = {
      id: `DEV-${Date.now()}`,
      requestId: request.id,
      goldType,
      weight,
      goldPricePerGram,
      laborCost,
      stonesDescription,
      stonesCost,
      discount,
      totalPrice,
      validUntil: validUntil.toISOString(),
      notes,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    // Envoyer par WhatsApp et/ou Email
    if (sendMode === 'whatsapp' || sendMode === 'both') {
      const message = encodeURIComponent(
        `🔹 *DEVIS ${quote.id}* 🔹\n\n` +
        `👤 *Client*: ${request.customer.fullName}\n` +
        `📞 *Téléphone*: ${request.customer.phone}\n` +
        `📧 *Email*: ${request.customer.email}\n\n` +
        `💰 *Total*: ${formatPrice(totalPrice)}\n` +
        `⏰ *Validité*: ${validUntil.toLocaleDateString('fr-FR')}\n\n` +
        `📝 *Notes*: ${notes || 'Aucune'}\n\n` +
        `Pour confirmer, veuillez nous contacter.\n\n` +
        `*Ce devis a été envoyé par email également.*`
      );
      
      window.open(`https://wa.me/${request.customer.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
      toast.success('Message WhatsApp ouvert');
    }
    
    if (sendMode === 'email' || sendMode === 'both') {
      const subject = encodeURIComponent(`Devis ${quote.id} - ${request.customer.fullName}`);
      const body = encodeURIComponent(
        `Cher/Chère ${request.customer.fullName},\n\n` +
        `Veuillez trouver ci-dessous votre devis:\n\n` +
        `Devis: ${quote.id}\n` +
        `Total: ${formatPrice(totalPrice)}\n` +
        `Validité: ${validUntil.toLocaleDateString('fr-FR')}\n\n` +
        `Notes: ${notes || 'Aucune'}\n\n` +
        `Pour toute question, n'hésitez pas à nous contacter.\n\n` +
        `Cordialement,\n` +
        `L'équipe`
      );
      
      window.open(`mailto:${request.customer.email}?subject=${subject}&body=${body}`, '_blank');
      toast.success('Client email ouvert');
    }
    
    if (sendMode === 'both') {
      toast.success('Devis envoyé par WhatsApp et Email');
    }

    onQuoteSent(request.id, quote);
    setIsSending(false);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Créer un devis - {request.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-body font-medium text-lg">{request.customer.fullName}</p>
                <p className="font-body text-sm text-muted-foreground">{request.customer.email}</p>
                <p className="font-body text-sm text-muted-foreground">{request.customer.phone}</p>
              </div>
              <div className="flex gap-1">
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
            <div className="text-xs text-muted-foreground">
              <p>Mode d'envoi: <span className="font-medium">{sendMode === 'whatsapp' ? 'WhatsApp' : sendMode === 'email' ? 'Email' : 'Les deux'}</span></p>
            </div>
          </div>

          {/* Gold Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body">Type d'or</Label>
              <Select value={goldType} onValueChange={(v) => setGoldType(v as GoldType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(goldTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-body">Poids estimé (g)</Label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.1}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="font-body">Prix de l'or (MAD/g)</Label>
              <Input
                type="number"
                value={goldPricePerGram}
                onChange={(e) => setGoldPricePerGram(parseFloat(e.target.value) || 0)}
                min={0}
                className="mt-1"
              />
            </div>

            <div className="flex items-end">
              <div className="bg-primary/10 rounded-lg p-3 w-full">
                <p className="font-body text-xs text-muted-foreground">Coût de l'or</p>
                <p className="font-display text-lg">{formatPrice(goldCost)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Labor Cost */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body">Main d'œuvre (MAD)</Label>
              <Input
                type="number"
                value={laborCost}
                onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                min={0}
                placeholder="Frais de fabrication"
                className="mt-1"
              />
            </div>
          </div>

          {/* Stones */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label className="font-body">Description des pierres</Label>
              <Input
                value={stonesDescription}
                onChange={(e) => setStonesDescription(e.target.value)}
                placeholder="Ex: 3 diamants 0.5ct, rubis central..."
                className="mt-1"
              />
            </div>
            <div>
              <Label className="font-body">Coût des pierres (MAD)</Label>
              <Input
                type="number"
                value={stonesCost}
                onChange={(e) => setStonesCost(parseFloat(e.target.value) || 0)}
                min={0}
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          {/* Discount */}
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
              <Select value={validDays.toString()} onValueChange={(v) => setValidDays(parseInt(v))}>
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

          {/* Notes */}
          <div>
            <Label className="font-body">Notes / Conditions</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Délai de fabrication, conditions de paiement..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Summary */}
          <div className="bg-charcoal text-cream rounded-lg p-4 space-y-2">
            <div className="flex justify-between font-body text-sm">
              <span>Coût or ({weight}g × {formatPrice(goldPricePerGram)})</span>
              <span>{formatPrice(goldCost)}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span>Main d'œuvre</span>
              <span>{formatPrice(laborCost)}</span>
            </div>
            {stonesCost > 0 && (
              <div className="flex justify-between font-body text-sm">
                <span>Pierres</span>
                <span>{formatPrice(stonesCost)}</span>
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
            disabled={isSending || weight <= 0}
            className="bg-primary text-primary-foreground"
          >
            {isSending ? (
              'Envoi en cours...'
            ) : (
              <>
                {sendMode === 'both' ? (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer par WhatsApp et Email
                  </>
                ) : sendMode === 'whatsapp' ? (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Envoyer par WhatsApp
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer par Email
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
