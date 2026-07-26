import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/utils/formatPrice';
import { ThemeHome } from '@/components/themes/ThemeHome';
import { useDesignDemoRequired } from '@/demo/DesignDemoContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function DemoHomePage() {
  const demo = useDesignDemoRequired();
  return (
    <ThemeHome
      themeKey={demo.themeKey}
      siteName={demo.brand.siteName}
      tagline={demo.brand.tagline}
      aboutText={demo.brand.aboutText}
      heroImage={demo.heroImage}
      products={demo.products}
      categories={demo.categories}
    />
  );
}

export function DemoBoutiquePage() {
  const demo = useDesignDemoRequired();
  const [params] = useSearchParams();
  const category = params.get('category');
  const keyword = params.get('keyword');
  const products = demo.filterProducts({ category, keyword });

  return (
    <div className={cn('mx-auto max-w-6xl px-4 py-10 sm:px-6', demoShellClass(demo.themeKey))}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Catalogue démo</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Boutique</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} produit{products.length > 1 ? 's' : ''} fictif
            {products.length > 1 ? 's' : ''}
            {category ? ` · ${category}` : ''}
            {keyword ? ` · « ${keyword} »` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={!category ? 'default' : 'outline'}
            asChild
            className={chipClass(demo.themeKey)}
          >
            <Link to={demo.path('/boutique')}>Tous</Link>
          </Button>
          {demo.categories.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={category === c.slug ? 'default' : 'outline'}
              asChild
              className={chipClass(demo.themeKey)}
            >
              <Link to={demo.path(`/boutique?category=${c.slug}`)}>{c.name}</Link>
            </Button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          'grid gap-6',
          demo.themeKey === 'minimal' && 'grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3',
          demo.themeKey === 'bold' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3',
          demo.themeKey === 'elegant' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10',
          demo.themeKey === 'classic' && 'grid-cols-2 lg:grid-cols-4',
        )}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            to={demo.path(`/produit/${p.id}`)}
            className={cn(
              'group block',
              demo.themeKey === 'bold' && 'border-2 border-white/15 overflow-hidden',
              demo.themeKey === 'elegant' && 'text-center',
            )}
          >
            <div
              className={cn(
                'overflow-hidden bg-muted',
                demo.themeKey === 'minimal' && 'aspect-[3/4] rounded-none',
                demo.themeKey === 'bold' && 'aspect-square rounded-none',
                demo.themeKey === 'elegant' && 'aspect-[3/4] rounded-none',
                demo.themeKey === 'classic' && 'aspect-[4/5] rounded-2xl',
              )}
            >
              <img
                src={p.images[0]}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <p
              className={cn(
                'mt-3 font-display',
                demo.themeKey === 'elegant' && 'italic text-lg',
                demo.themeKey === 'bold' && 'font-bold uppercase px-2',
                demo.themeKey === 'minimal' && 'text-sm tracking-wide',
                demo.themeKey === 'classic' && 'font-semibold',
              )}
            >
              {p.name}
            </p>
            <p
              className={cn(
                'text-sm',
                demo.themeKey === 'bold' ? 'px-2 pb-3 font-black text-primary' : 'text-muted-foreground',
              )}
            >
              {formatPrice(p.price)}
              {!p.inStock ? ' · Rupture' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function DemoProductPage() {
  const demo = useDesignDemoRequired();
  const { id } = useParams<{ id: string }>();
  const product = id ? demo.getProduct(id) : undefined;
  const related = demo.products.filter((p) => p.id !== id && p.category === product?.category).slice(0, 3);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Produit introuvable</h1>
        <Button className="mt-6" asChild>
          <Link to={demo.path('/boutique')}>Retour boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('mx-auto max-w-6xl px-4 py-10 sm:px-6', demoShellClass(demo.themeKey))}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div
          className={cn(
            'overflow-hidden bg-muted',
            demo.themeKey === 'classic' && 'rounded-2xl',
            demo.themeKey === 'elegant' && 'rounded-none',
            demo.themeKey === 'bold' && 'border-4 border-primary',
          )}
        >
          <img src={product.images[0]} alt="" className="aspect-[4/5] w-full object-cover" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
          <h1
            className={cn(
              'mt-2 font-display text-3xl sm:text-4xl',
              demo.themeKey === 'elegant' && 'italic font-light',
              demo.themeKey === 'bold' && 'font-black uppercase',
              demo.themeKey === 'minimal' && 'font-medium tracking-tight',
            )}
          >
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold">{formatPrice(product.price)}</p>
          {product.originalPrice ? (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </p>
          ) : null}
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className={cn(demo.themeKey === 'bold' && 'rounded-none uppercase font-bold', demo.themeKey === 'elegant' && 'rounded-full')}
              disabled={!product.inStock}
              onClick={() => {
                demo.addToCart(product);
                toast.success('Ajouté au panier démo');
              }}
            >
              {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
            </Button>
            <Button size="lg" variant="outline" asChild className={cn(demo.themeKey === 'bold' && 'rounded-none', demo.themeKey === 'elegant' && 'rounded-full')}>
              <Link to={demo.path('/panier')}>Voir le panier</Link>
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-semibold">Vous aimerez aussi</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} to={demo.path(`/produit/${p.id}`)} className="group">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={p.images[0]} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <p className="mt-3 font-display font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function DemoCartPage() {
  const demo = useDesignDemoRequired();

  return (
    <div className={cn('mx-auto max-w-3xl px-4 py-10 sm:px-6', demoShellClass(demo.themeKey))}>
      <h1 className="font-display text-3xl font-bold">Panier (démo)</h1>
      <p className="mt-1 text-sm text-muted-foreground">Panier fictif — aucune commande réelle.</p>

      {demo.cart.length === 0 ? (
        <div className="mt-12 text-center">
          <p>Votre panier démo est vide.</p>
          <Button className="mt-4" asChild>
            <Link to={demo.path('/boutique')}>Continuer vos achats</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {demo.cart.map((line) => (
            <div
              key={line.product.id}
              className="flex flex-wrap items-center gap-4 border border-border p-3 sm:flex-nowrap"
            >
              <img
                src={line.product.images[0]}
                alt=""
                className="h-20 w-20 shrink-0 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold">{line.product.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(line.product.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => demo.updateQty(line.product.id, line.quantity - 1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-6 text-center text-sm">{line.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => demo.updateQty(line.product.id, line.quantity + 1)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={() => demo.removeFromCart(line.product.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-border pt-6">
            <p className="font-display text-lg font-semibold">Total</p>
            <p className="text-xl font-bold">{formatPrice(demo.cartTotal)}</p>
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={() => toast.message('Démo uniquement — checkout désactivé')}
          >
            Passer commande (simulé) <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function DemoContactPage() {
  const demo = useDesignDemoRequired();
  return (
    <div className={cn('mx-auto max-w-xl px-4 py-12 sm:px-6', demoShellClass(demo.themeKey))}>
      <h1 className="font-display text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-muted-foreground">
        Formulaire démo pour {demo.brand.siteName} — les messages ne sont pas envoyés.
      </p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success('Message démo enregistré (fictif)');
        }}
      >
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" className="mt-1.5" defaultValue="Sara Benali" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1.5" defaultValue="sara@example.com" />
        </div>
        <div>
          <Label htmlFor="msg">Message</Label>
          <Textarea id="msg" className="mt-1.5" rows={4} defaultValue="Bonjour, j’aimerais en savoir plus sur vos délais de livraison." />
        </div>
        <Button type="submit" className={cn(demo.themeKey === 'elegant' && 'rounded-full', demo.themeKey === 'bold' && 'rounded-none uppercase font-bold')}>
          Envoyer
        </Button>
      </form>
    </div>
  );
}

export function DemoSurMesurePage() {
  const demo = useDesignDemoRequired();
  return (
    <div className={cn('mx-auto max-w-2xl px-4 py-12 sm:px-6', demoShellClass(demo.themeKey))}>
      <h1 className="font-display text-3xl font-bold">Sur-mesure</h1>
      <p className="mt-2 text-muted-foreground">
        Décrivez votre projet — page démo avec données fictives.
      </p>
      <div className="mt-8 space-y-4 rounded-2xl border border-border p-6">
        <div>
          <Label>Type de projet</Label>
          <Input className="mt-1.5" defaultValue="Packaging personnalisé" />
        </div>
        <div>
          <Label>Budget indicatif</Label>
          <Input className="mt-1.5" defaultValue="1 500 – 3 000 DHS" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            className="mt-1.5"
            rows={4}
            defaultValue="Je souhaite un packaging sur-mesure pour une ligne cosmétique, palette or et ivoire, 500 unités."
          />
        </div>
        <Button
          onClick={() => toast.success('Demande démo envoyée (fictive)')}
          className={cn(demo.themeKey === 'elegant' && 'rounded-full', demo.themeKey === 'bold' && 'rounded-none uppercase font-bold')}
        >
          Envoyer la demande
        </Button>
      </div>
    </div>
  );
}

export function DemoFaqPage() {
  const demo = useDesignDemoRequired();
  return (
    <div className={cn('mx-auto max-w-2xl px-4 py-12 sm:px-6', demoShellClass(demo.themeKey))}>
      <h1 className="font-display text-3xl font-bold">FAQ</h1>
      <div className="mt-8 space-y-4">
        {demo.faqs.map((f) => (
          <details key={f.q} className="group rounded-xl border border-border p-4 open:bg-muted/30">
            <summary className="cursor-pointer font-display font-semibold">{f.q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function DemoLivraisonPage() {
  const demo = useDesignDemoRequired();
  return (
    <div className={cn('mx-auto max-w-2xl px-4 py-12 sm:px-6', demoShellClass(demo.themeKey))}>
      <h1 className="font-display text-3xl font-bold">Livraison & retours</h1>
      <ul className="mt-8 space-y-4">
        {[
          'Livraison Casablanca / Rabat sous 24–48 h',
          'Autres villes : 2–4 jours ouvrés',
          'Frais offerts dès 500 DHS (exemple démo)',
          'Retours sous 14 jours — article intact',
          'Échanges possibles via le service client',
        ].map((line) => (
          <li key={line} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <Button className="mt-8" asChild>
        <Link to={demo.path('/contact')}>Contacter le support</Link>
      </Button>
    </div>
  );
}

export function DemoWishlistPage() {
  const demo = useDesignDemoRequired();
  const favs = demo.products.slice(0, 3);
  return (
    <div className={cn('mx-auto max-w-4xl px-4 py-12 sm:px-6', demoShellClass(demo.themeKey))}>
      <h1 className="font-display text-3xl font-bold">Favoris</h1>
      <p className="mt-1 text-sm text-muted-foreground">Liste fictive pour la démo.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {favs.map((p) => (
          <Link key={p.id} to={demo.path(`/produit/${p.id}`)} className="group">
            <div className="aspect-square overflow-hidden bg-muted">
              <img src={p.images[0]} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <p className="mt-3 font-display font-medium">{p.name}</p>
            <p className="text-sm text-muted-foreground">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function demoShellClass(themeKey: string) {
  if (themeKey === 'bold') return 'text-white [&_.text-muted-foreground]:text-white/65';
  if (themeKey === 'minimal') return 'text-neutral-900';
  if (themeKey === 'elegant') return 'text-[hsl(280_20%_18%)]';
  return '';
}

function chipClass(themeKey: string) {
  if (themeKey === 'bold') return 'rounded-none';
  if (themeKey === 'elegant') return 'rounded-full';
  return '';
}
