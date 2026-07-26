import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { productReviewsApi } from '@/services/api/productReviews';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

function StarRatingDisplay({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' }) {
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(icon, n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40')}
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="rounded p-0.5 transition hover:scale-110"
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
        >
          <Star className={cn('h-6 w-6', n <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/50')} />
        </button>
      ))}
    </div>
  );
}

type Props = {
  productId: string;
  productName: string;
};

export function ProductReviewsSection({ productId, productName }: Props) {
  const queryClient = useQueryClient();
  const numericId = Number(productId);
  const enabled = Number.isFinite(numericId);

  const { data, isLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => productReviewsApi.getPublicSummary(numericId),
    enabled,
    staleTime: 60_000,
  });

  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const submitMutation = useMutation({
    mutationFn: () =>
      productReviewsApi.submitPublic({
        productId: numericId,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        rating,
        title: title.trim() || undefined,
        body: body.trim(),
      }),
    onSuccess: () => {
      toast.success('Merci ! Votre avis sera publié après validation.');
      setAuthorName('');
      setAuthorEmail('');
      setTitle('');
      setBody('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
    },
    onError: (err: unknown) => toastError(err, 'Envoi impossible'),
  });

  if (!enabled) return null;

  const avg = data?.averageRating ?? 0;
  const count = data?.reviewCount ?? 0;
  const reviews = data?.reviews ?? [];

  return (
    <section className="mt-10 sm:mt-14 border-t border-border pt-10 px-3 sm:px-6 max-w-[1280px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="font-display text-xl sm:text-2xl text-foreground">Avis clients</h3>
          {isLoading ? (
            <p className="text-sm text-muted-foreground mt-1">Chargement…</p>
          ) : count > 0 ? (
            <div className="flex items-center gap-3 mt-2">
              <StarRatingDisplay value={avg} />
              <span className="text-sm text-muted-foreground">
                {avg.toFixed(1)} · {count} avis
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">Soyez le premier à laisser un avis.</p>
          )}
        </div>
      </div>

      {reviews.length > 0 && (
        <ul className="space-y-4 mb-10">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <StarRatingDisplay value={r.rating} size="sm" />
                <time className="text-xs text-muted-foreground">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-MA') : ''}
                </time>
              </div>
              {r.title ? <p className="font-semibold text-sm text-foreground">{r.title}</p> : null}
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{r.body}</p>
              <p className="text-xs text-muted-foreground mt-3">— {r.authorName}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
        <h4 className="font-display font-semibold text-foreground mb-4">Laisser un avis sur {productName}</h4>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!authorName.trim() || !body.trim()) {
              toast.error('Nom et commentaire requis');
              return;
            }
            submitMutation.mutate();
          }}
        >
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Note</Label>
            <div className="mt-1.5">
              <StarPicker value={rating} onChange={setRating} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="review-name">Votre nom *</Label>
              <Input
                id="review-name"
                className="mt-1.5 rounded-xl"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="review-email">Email (optionnel)</Label>
              <Input
                id="review-email"
                type="email"
                className="mt-1.5 rounded-xl"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="review-title">Titre (optionnel)</Label>
            <Input
              id="review-title"
              className="mt-1.5 rounded-xl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="review-body">Votre avis *</Label>
            <Textarea
              id="review-body"
              className="mt-1.5 min-h-[100px] rounded-xl"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={submitMutation.isPending} className="rounded-xl gap-2">
            {submitMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Envoyer mon avis
          </Button>
        </form>
      </div>
    </section>
  );
}

export function useProductReviewJsonLd(
  productId: string,
  productName: string,
  enabled: boolean,
) {
  const numericId = Number(productId);
  const { data } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => productReviewsApi.getPublicSummary(numericId),
    enabled: enabled && Number.isFinite(numericId),
    staleTime: 60_000,
  });

  return data && data.reviewCount > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productName,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: data.averageRating,
          reviewCount: data.reviewCount,
        },
      }
    : null;
}
