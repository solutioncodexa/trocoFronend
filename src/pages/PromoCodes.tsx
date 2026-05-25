import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Copy, Check, Tag, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { promoCodesApi } from '@/services/api/promoCodes';
import { formatPrice } from '@/utils/formatPrice';

const PromoCodes = () => {
  const { data: codes = [], isLoading } = useQuery({
    queryKey: ['public-promo-codes'],
    queryFn: promoCodesApi.getPublicCodes,
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Layout>
      <main className="max-w-[900px] mx-auto px-6 py-12">
        <div className="mb-4">
          <Link
            to="/checkout"
            className="inline-flex items-center gap-1.5 text-sm text-accent-beige hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au checkout
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-display text-secondary-dark dark:text-white">
              Codes Promo
            </h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-accent-beige font-body max-w-md mx-auto">
            Copiez un code promo ci-dessous et utilisez-le lors de votre commande pour profiter de la réduction.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-accent-beige">Chargement...</div>
        ) : codes.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-display mb-2">Aucun code promo disponible</h2>
            <p className="text-sm text-muted-foreground">
              Revenez plus tard pour découvrir nos offres !
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {codes.map((promo) => (
              <div
                key={promo.code}
                className="relative bg-white dark:bg-[#1e1a12] border-2 border-dashed border-primary/30 rounded-xl p-6 hover:border-primary/60 transition-all group"
              >
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute top-3 -right-5 rotate-45 bg-primary text-white text-[10px] font-bold px-6 py-0.5 shadow-sm">
                    {promo.discountType === 'percentage'
                      ? `-${promo.discountValue}%`
                      : `-${promo.discountValue} DH`}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-accent-beige uppercase tracking-widest mb-1">
                    Commande minimum
                  </p>
                  <p className="text-lg font-display text-secondary-dark dark:text-white">
                    {promo.minOrderAmount ? formatPrice(promo.minOrderAmount) : 'Aucun minimum'}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-accent-beige uppercase tracking-widest mb-1">
                    Réduction
                  </p>
                  <p className="text-2xl font-display text-primary font-bold">
                    {promo.discountType === 'percentage'
                      ? `${promo.discountValue}%`
                      : `${formatPrice(promo.discountValue)}`}
                  </p>
                </div>

                {promo.expiresAt && (
                  <p className="text-[10px] text-accent-beige mb-3">
                    Expire le{' '}
                    {new Date(promo.expiresAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}

                <button
                  onClick={() => handleCopy(promo.code)}
                  className="w-full flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 transition-all"
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-600">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-primary" />
                      <code className="font-mono font-bold text-sm text-primary tracking-wider">
                        {promo.code}
                      </code>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/checkout"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-[#d9a50b] transition-all shadow-lg"
          >
            Utiliser dans le checkout
          </Link>
        </div>
      </main>
    </Layout>
  );
};

export default PromoCodes;
