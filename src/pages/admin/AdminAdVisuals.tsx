import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productsApi } from '@/services/api/products';
import { aiCopyApi } from '@/services/api/aiCopy';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';
import { toastError } from '@/utils/toastMessages';
import { AD_FORMATS, canvasToBlob, renderAdVisual, type AdFormat } from '@/utils/adVisual';

const MAX_VARIANTS = 3;
const HEX = /^#[0-9a-fA-F]{6}$/;

/** Affiches et visuels pub (Facebook / Instagram) générés dans le navigateur, à télécharger. */
const AdminAdVisuals = () => {
  const brand = useStoreBrand();
  const { data: page } = useQuery({
    queryKey: ['ad-visuals-products'],
    queryFn: () => productsApi.getAllProducts({ page: 0, size: 100 }),
    staleTime: 60_000,
  });
  const products = page?.content ?? [];

  const [productId, setProductId] = useState('');
  const [format, setFormat] = useState<AdFormat>('square');
  const [headline, setHeadline] = useState('');
  const [color, setColor] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [variants, setVariants] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [exportError, setExportError] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const product = useMemo(() => products.find((p) => String(p.id) === productId), [products, productId]);

  useEffect(() => {
    if (!productId && products.length > 0) setProductId(String(products[0].id));
  }, [products, productId]);
  useEffect(() => {
    if (product && !headline) setHeadline(product.name);
  }, [product, headline]);
  useEffect(() => {
    if (!color && brand.primaryColor) setColor(brand.primaryColor);
  }, [brand.primaryColor, color]);
  useEffect(() => {
    const wa = brand.contactWhatsapp || brand.contactPhone || '';
    if (!whatsapp && wa) setWhatsapp(wa);
  }, [brand.contactWhatsapp, brand.contactPhone, whatsapp]);

  const input = useMemo(
    () => ({
      format,
      storeName: brand.siteName,
      headline: headline || product?.name || brand.siteName,
      priceLabel: product ? `${Number(product.price).toLocaleString('fr-FR')} MAD` : '',
      whatsapp,
      primaryColor: color,
      logoUrl: brand.logoUrl,
      productImageUrl: product?.images?.[0] ? resolvePublicImageUrl(product.images[0]) : null,
    }),
    [format, brand.siteName, brand.logoUrl, headline, product, whatsapp, color],
  );

  useEffect(() => {
    let cancelled = false;
    void renderAdVisual(input).then((canvas) => {
      if (cancelled || !previewRef.current) return;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.style.borderRadius = '8px';
      previewRef.current.replaceChildren(canvas);
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  const suggest = async () => {
    if (!product) return;
    setSuggesting(true);
    try {
      const out: string[] = [];
      for (const locale of ['fr', 'ar', 'en'] as const) {
        if (out.length >= MAX_VARIANTS) break;
        const res = await aiCopyApi.generate({
          kind: 'ad_headline',
          topic: product.name,
          storeName: brand.siteName,
          tone: 'friendly',
          locale,
        });
        const text = typeof res.text === 'string' ? res.text : '';
        if (text && res.source === 'llm' && !out.includes(text)) out.push(text);
      }
      if (out.length === 0) toast.info('L’IA n’est pas disponible pour le moment : saisissez votre texte.');
      setVariants(out);
    } catch (e) {
      toastError(e, 'Suggestions indisponibles');
    } finally {
      setSuggesting(false);
    }
  };

  const download = async (type: 'image/png' | 'image/jpeg') => {
    setExportError(false);
    try {
      const canvas = await renderAdVisual(input);
      const blob = await canvasToBlob(canvas, type);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visuel-${format}-${productId || 'boutique'}.${type === 'image/png' ? 'png' : 'jpg'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Photo hébergée sans autorisation CORS : le navigateur interdit d'exporter l'image.
      setExportError(true);
    }
  };

  return (
    <AdminLayout
      title="Affiches et visuels pub"
      description="Créez un visuel à partir de votre logo, de vos couleurs et d’un produit."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="space-y-1.5">
            <Label>Produit</Label>
            <Select
              value={productId}
              onValueChange={(v) => {
                setProductId(v);
                setHeadline('');
                setVariants([]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un produit" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as AdFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(AD_FORMATS) as AdFormat[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {AD_FORMATS[k].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ad-headline">Titre</Label>
            <Input id="ad-headline" value={headline} maxLength={90} onChange={(e) => setHeadline(e.target.value)} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!product || suggesting}
              onClick={() => void suggest()}
            >
              {suggesting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Proposer des titres (FR / AR / EN)
            </Button>
            {variants.length > 0 ? (
              <ul className="space-y-1 pt-1">
                {variants.map((v) => (
                  <li key={v}>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-border px-3 py-2 text-start text-sm hover:bg-muted"
                      onClick={() => setHeadline(v)}
                    >
                      {v}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ad-color">Couleur</Label>
              <Input
                id="ad-color"
                type="color"
                value={HEX.test(color) ? color : '#1e3a5f'}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 p-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ad-wa">WhatsApp</Label>
              <Input id="ad-wa" value={whatsapp} maxLength={25} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="button" className="gap-1.5" onClick={() => void download('image/png')}>
              <Download className="h-4 w-4" /> PNG
            </Button>
            <Button type="button" variant="outline" className="gap-1.5" onClick={() => void download('image/jpeg')}>
              <Download className="h-4 w-4" /> JPG
            </Button>
          </div>
          {exportError ? (
            <p className="text-xs text-destructive">
              Export impossible : la photo du produit est hébergée sans autorisation d’export (CORS). Faites une capture
              d’écran de l’aperçu ou contactez le support.
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Aucune publication automatique : téléchargez le visuel puis ajoutez-le dans Facebook / Instagram Ads. Le prix
            affiché est celui du catalogue ; vérifiez le texte avant de diffuser.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <div ref={previewRef} className="mx-auto max-w-xl" aria-label="Aperçu du visuel" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAdVisuals;
