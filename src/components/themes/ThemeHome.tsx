import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatPrice';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import type { StoreThemeKey } from '@/config/storeThemes';
import type { Product } from '@/types/product';
import type { DemoCategory } from '@/demo/mockCatalog';
import { cn } from '@/lib/utils';

type ThemeHomeProps = {
  themeKey: StoreThemeKey;
  siteName: string;
  tagline: string;
  aboutText?: string;
  heroImage: string;
  products: Product[];
  categories: DemoCategory[];
};

export function ThemeHome(props: ThemeHomeProps) {
  switch (props.themeKey) {
    case 'minimal':
      return <MinimalHome {...props} />;
    case 'bold':
      return <BoldHome {...props} />;
    case 'elegant':
      return <ElegantHome {...props} />;
    default:
      return <ClassicHome {...props} />;
  }
}

function ClassicHome({
  siteName,
  tagline,
  aboutText,
  heroImage,
  products,
  categories,
}: ThemeHomeProps) {
  const { to } = useStorefrontPath();
  const featured = products.slice(0, 4);

  return (
    <div className="theme-home theme-home--classic">
      <section className="relative min-h-[min(88dvh,720px)] overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        <div className="relative mx-auto flex min-h-[min(88dvh,720px)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{siteName}</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {tagline}
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">{aboutText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to={to('/boutique')}>
                Voir la boutique <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={to('/contact')}>Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: Truck, t: 'Livraison rapide', d: 'Partout au Maroc' },
            { icon: Shield, t: 'Paiement sécurisé', d: 'COD ou en ligne' },
            { icon: Star, t: 'Sélection soignée', d: 'Qualité garantie' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display font-semibold">{t}</p>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Catégories</h2>
          <Link to={to('/boutique')} className="text-sm font-medium text-primary hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              to={to(`/boutique?category=${c.slug}`)}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img
                src={c.image}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-display text-lg font-semibold">{c.name}</p>
                {c.count > 0 ? (
                  <p className="text-xs text-white/70">{c.count} articles</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/20 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 font-display text-2xl font-bold sm:text-3xl">Sélection</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MinimalHome({ siteName, tagline, products, categories }: ThemeHomeProps) {
  const { to } = useStorefrontPath();
  const list = products.filter((p) => p.inStock).slice(0, 6);

  return (
    <div className="theme-home theme-home--minimal bg-[hsl(0_0%_99%)] text-[hsl(0_0%_10%)]">
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-20 text-center sm:px-6 sm:pt-28">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-neutral-500">
          {siteName}
        </p>
        <h1 className="mt-6 font-display text-5xl font-medium tracking-[-0.04em] sm:text-6xl md:text-7xl">
          {tagline}
        </h1>
        <div className="mx-auto mt-10 h-px w-16 bg-neutral-900" />
        <div className="mt-10 flex justify-center gap-8 text-sm tracking-wide">
          <Link to={to('/boutique')} className="underline-offset-4 hover:underline">
            Shop
          </Link>
          <Link to={to('/contact')} className="underline-offset-4 hover:underline">
            Contact
          </Link>
          <Link to={to('/sur-mesure')} className="underline-offset-4 hover:underline">
            Sur-mesure
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8">
          {list.map((p) => (
            <Link key={p.id} to={to(`/produit/${p.id}`)} className="group text-left">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={p.images[0]}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-4 text-sm tracking-wide">{p.name}</p>
              <p className="mt-1 text-sm text-neutral-500">{formatPrice(p.price)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Collections</p>
        <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={to(`/boutique?category=${c.slug}`)}
              className="underline-offset-4 hover:underline"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function BoldHome({ siteName, tagline, aboutText, heroImage, products, categories }: ThemeHomeProps) {
  const { to } = useStorefrontPath();
  const deal = products.find((p) => p.originalPrice) ?? products[0];
  const grid = products.slice(0, 6);

  return (
    <div className="theme-home theme-home--bold bg-[hsl(350_40%_8%)] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-[hsl(350_70%_12%/0.75)]" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-none bg-[hsl(var(--primary))] px-3 py-1 text-xs font-black uppercase tracking-widest text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Flash sale
            </span>
            <h1 className="mt-5 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              {tagline}
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/75">{aboutText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-none px-8 text-base font-bold uppercase tracking-wider shadow-none"
                asChild
              >
                <Link to={to('/boutique')}>Shop now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-none border-white/40 bg-transparent text-white hover:bg-white hover:text-black"
                asChild
              >
                <Link to={to(`/produit/${deal.id}`)}>
                  -
                  {deal.originalPrice
                    ? Math.round(
                        ((deal.originalPrice - deal.price) / deal.originalPrice) * 100,
                      )
                    : 15}
                  %
                </Link>
              </Button>
            </div>
          </div>
          <Link
            to={to(`/produit/${deal.id}`)}
            className="relative aspect-square overflow-hidden border-4 border-[hsl(var(--primary))] bg-black/40"
          >
            <img src={deal.images[0]} alt="" className="h-full w-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-black/70 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">
                Deal du moment
              </p>
              <p className="font-display text-xl font-bold">{deal.name}</p>
              <p className="text-2xl font-black">{formatPrice(deal.price)}</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="border-y-4 border-[hsl(var(--primary))] bg-[hsl(var(--primary))] py-3 text-center text-sm font-black uppercase tracking-[0.2em] text-primary-foreground">
        {siteName} · Livraison 48h · Retours faciles · Sur-mesure
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 font-display text-3xl font-black uppercase">Catégories hot</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={to(`/boutique?category=${c.slug}`)}
              className="flex aspect-[3/2] items-end border-2 border-white/20 bg-cover bg-center p-3 font-bold uppercase transition hover:border-[hsl(var(--primary))]"
              style={{ backgroundImage: `linear-gradient(to top,rgba(0,0,0,.75),transparent),url(${c.image})` }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 font-display text-3xl font-black uppercase">Best sellers</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((p, i) => (
            <Link
              key={p.id}
              to={to(`/produit/${p.id}`)}
              className={cn(
                'group relative overflow-hidden border-2 border-white/15',
                i === 0 && 'sm:col-span-2 sm:row-span-2',
              )}
            >
              <div className={cn('overflow-hidden', i === 0 ? 'aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[420px]' : 'aspect-square')}>
                <img
                  src={p.images[0]}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black via-black/60 to-transparent p-4">
                <div>
                  <p className="font-display text-lg font-bold">{p.name}</p>
                  <p className="text-xl font-black text-[hsl(var(--primary))]">{formatPrice(p.price)}</p>
                </div>
                <span className="rounded-none bg-white px-2 py-1 text-xs font-black uppercase text-black">
                  Buy
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ElegantHome({
  siteName,
  tagline,
  aboutText,
  heroImage,
  products,
  categories,
}: ThemeHomeProps) {
  const { to } = useStorefrontPath();
  const editorial = products.slice(0, 3);
  const more = products.slice(3, 7);

  return (
    <div className="theme-home theme-home--elegant bg-[hsl(40_30%_97%)] text-[hsl(280_20%_18%)]">
      <section className="relative min-h-[min(92dvh,800px)]">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(280_25%_12%/0.35)]" />
        <div className="relative mx-auto flex min-h-[min(92dvh,800px)] max-w-5xl flex-col items-center justify-center px-4 text-center text-white">
          <p className="text-[11px] uppercase tracking-[0.45em] text-white/80">{siteName}</p>
          <h1 className="mt-6 font-display text-4xl font-light italic leading-tight sm:text-5xl md:text-6xl">
            {tagline}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/85">{aboutText}</p>
          <Button
            size="lg"
            className="mt-10 rounded-full bg-white px-10 text-[hsl(280_20%_18%)] hover:bg-white/90"
            asChild
          >
            <Link to={to('/boutique')}>Découvrir la collection</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[hsl(var(--primary))]">Éditorial</p>
          <h2 className="mt-3 font-display text-3xl font-light italic sm:text-4xl">Pièces choisies</h2>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {editorial.map((p, i) => (
            <Link
              key={p.id}
              to={to(`/produit/${p.id}`)}
              className={cn('group', i === 1 && 'md:mt-12')}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={p.images[0]}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-5 text-center font-display text-lg italic">{p.name}</p>
              <p className="mt-1 text-center text-sm tracking-widest text-muted-foreground">
                {formatPrice(p.price)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[hsl(280_15%_85%)] bg-white/60 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
          {categories.slice(0, 4).map((c) => (
            <Link key={c.id} to={to(`/boutique?category=${c.slug}`)} className="text-center">
              <div className="mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-full">
                <img src={c.image} alt="" className="h-full w-full object-cover" />
              </div>
              <p className="mt-4 font-display text-sm tracking-[0.2em] uppercase">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {more.map((p) => (
            <Link
              key={p.id}
              to={to(`/produit/${p.id}`)}
              className="group grid grid-cols-[120px_1fr] items-center gap-5 border-b border-[hsl(280_15%_88%)] pb-8 sm:grid-cols-[160px_1fr]"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={p.images[0]}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div>
                <p className="font-display text-xl italic">{p.name}</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</p>
                <p className="mt-3 text-sm tracking-widest">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="outline" className="rounded-full px-8" asChild>
            <Link to={to('/boutique')}>Voir toute la boutique</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ProductTile({ product }: { product: Product }) {
  const { to } = useStorefrontPath();
  return (
    <Link to={to(`/produit/${product.id}`)} className="group block">
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        <img
          src={product.images[0]}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 font-display font-semibold">{product.name}</p>
      <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
    </Link>
  );
}
