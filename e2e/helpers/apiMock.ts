import type { Page, Route } from '@playwright/test';

function ok<T>(data: T, message?: string) {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

const productAtlas = {
  id: '1',
  name: 'Sachet Kraft Atlas',
  price: 12.5,
  images: ['/uploads/demo.png'],
  category: 'sachets',
  inStock: true,
  stockQuantity: 40,
  description: 'Sachet kraft premium',
};

const basicPlan = {
  id: 1,
  code: 'basic',
  name: 'Basic',
  description: 'Plan Basic Matjarona',
  priceMad: 79,
  currency: 'MAD',
  billingPeriod: 'MONTHLY',
  maxProducts: 50,
  maxStaff: 1,
  customDomain: false,
  active: true,
  features: { themes: 'basic', whatsappBusiness: false, webhooks: 'none' },
};

const storeAtlas = {
  id: 10,
  siteName: 'Maison Atlas',
  slug: 'maison-atlas',
  tagline: 'Emballage premium',
  primaryColor: '#0F766E',
  secondaryColor: '#134E4A',
  contactEmail: 'contact@maison-atlas.test',
  freeShippingThreshold: 750,
  heroEnabled: true,
  categoriesEnabled: true,
  surMesureEnabled: true,
  abandonedCartEnabled: true,
  abandonedCartDelayMinutes: 60,
  contactPhone: '+212600000000',
  contactWhatsapp: '+212612345678',
  whatsappOrderTemplate: 'Bonjour, je souhaite commander: {productName} ({url})',
  cookieConsentRequired: false,
  planCode: 'basic',
  planName: 'Basic',
};

const abandonedCartDemo = {
  id: 1,
  sessionKey: 'e2e-session',
  recoveryToken: 'recover-demo-token',
  customerEmail: 'client@exemple.ma',
  customerPhone: '+212600000001',
  customerName: 'Sara Demo',
  cartJson: JSON.stringify([
    { productId: '1', quantity: 2, name: 'Sachet Kraft Atlas', price: 12.5 },
  ]),
  cartTotal: 25,
  itemCount: 2,
  reminderSent: false,
  recovered: false,
  remindAt: new Date(Date.now() + 3_600_000).toISOString(),
  lastActivityAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

/**
 * Mock API Matjarona pour E2E UI (pas de backend requis).
 */
export async function mockMatjaronaApi(page: Page) {
  let lastLoginEmail = 'admin@maison-atlas.test';

  // Important : ne pas matcher `/src/services/api/**` (modules Vite).
  await page.route((url) => {
    try {
      const pathname = new URL(url).pathname;
      return pathname === '/api' || pathname.startsWith('/api/');
    } catch {
      return false;
    }
  }, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname.replace(/^\/api/, '') || '/';
    const method = req.method();

    if (method === 'GET' && path === '/platform/plans') {
      return json(route, ok([basicPlan]));
    }

    if (method === 'GET' && path === '/platform/store') {
      const slug = url.searchParams.get('slug') || 'troco';
      if (slug === 'maison-atlas') {
        return json(route, ok(storeAtlas));
      }
      return json(route, ok({
        ...storeAtlas,
        siteName: 'Troco',
        slug: 'troco',
        tagline: 'Solutions d\'emballage e-commerce',
      }));
    }

    if (method === 'POST' && path === '/platform/register') {
      const body = req.postDataJSON() as Record<string, string>;
      return json(route, ok({
        id: 99,
        name: body.name,
        slug: body.slug,
        email: body.adminEmail,
        status: 'ACTIVE',
        planCode: 'basic',
        planName: 'Basic',
        planPriceMad: 79,
      }));
    }

    if (method === 'POST' && path === '/auth/login') {
      const body = req.postDataJSON() as { email?: string; password?: string };
      if (body.password === 'bad') {
        return json(route, { success: false, message: 'Identifiants invalides', status: 401 }, 401);
      }
      lastLoginEmail = body.email || lastLoginEmail;
      const isSuper = lastLoginEmail.toLowerCase().includes('superadmin');
      return json(route, ok({
        access_token: isSuper ? 'e2e-token-super' : 'e2e-token',
        refresh_token: 'e2e-refresh',
        token_type: 'Bearer',
        id: isSuper ? 1 : 2,
        email: lastLoginEmail,
        role: isSuper ? 'SUPER_ADMIN' : 'ADMIN',
        fullName: isSuper ? 'Super Admin' : 'Admin Boutique',
        permissions: [
          'PRODUCTS_VIEW', 'PRODUCTS_CREATE', 'PRODUCTS_UPDATE', 'PRODUCTS_DELETE',
          'ORDERS_VIEW', 'ORDERS_UPDATE', 'STOCK_VIEW', 'STOCK_ADJUST',
          'CUSTOM_ORDERS_VIEW', 'CUSTOM_ORDERS_UPDATE', 'CATALOG_MANAGE',
          'CONTENT_MANAGE', 'STATS_VIEW', 'MEMBERS_MANAGE', 'AUDIT_VIEW',
          'PAGES_EDIT', 'PAGES_PUBLISH', 'WEBHOOKS_MANAGE',
        ],
        fournisseur_id: isSuper ? null : 10,
        expires_in: 3600,
      }));
    }

    if (method === 'GET' && path === '/auth/me') {
      const auth = req.headers()['authorization'] || '';
      const isSuper = auth.includes('super') || lastLoginEmail.toLowerCase().includes('superadmin');
      return json(route, ok({
        id: isSuper ? 1 : 2,
        email: lastLoginEmail,
        role: isSuper ? 'SUPER_ADMIN' : 'ADMIN',
        fullName: isSuper ? 'Super Admin' : 'Admin Boutique',
        permissions: [
          'PRODUCTS_VIEW', 'PRODUCTS_CREATE', 'PRODUCTS_UPDATE', 'PRODUCTS_DELETE',
          'ORDERS_VIEW', 'ORDERS_UPDATE', 'STOCK_VIEW', 'STOCK_ADJUST',
          'CUSTOM_ORDERS_VIEW', 'CUSTOM_ORDERS_UPDATE', 'CATALOG_MANAGE',
          'CONTENT_MANAGE', 'STATS_VIEW', 'MEMBERS_MANAGE', 'AUDIT_VIEW',
          'PAGES_EDIT', 'PAGES_PUBLISH', 'WEBHOOKS_MANAGE',
        ],
        fournisseurId: isSuper ? null : 10,
      }));
    }

    if (method === 'GET' && path === '/store-settings/me') {
      return json(route, ok(storeAtlas));
    }

    if (method === 'PUT' && path === '/store-settings/me') {
      const body = req.postDataJSON() as Record<string, unknown>;
      return json(route, ok({ ...storeAtlas, ...body }));
    }

    if (method === 'GET' && (path === '/products' || path === '/products/full-page')) {
      return json(route, ok({
        content: [productAtlas],
        page: 0,
        size: 20,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
      }));
    }

    if (method === 'GET' && path === '/products/by-ids') {
      return json(route, ok([productAtlas]));
    }

    if (method === 'GET' && path === '/products/1') {
      return json(route, ok({
        ...productAtlas,
        variants: [{ id: '1', label: 'Standard', price: 12.5, stock: 40, isDefault: true }],
      }));
    }

    if (method === 'GET' && path === '/categories') {
      return json(route, ok([{ id: 1, name: 'Sachets', slug: 'sachets', productCount: 1 }]));
    }

    if (method === 'GET' && path === '/orders') {
      return json(route, ok({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true }));
    }

    if (method === 'POST' && path === '/orders') {
      const body = (req.postDataJSON() as Record<string, unknown>) || {};
      return json(route, ok({
        id: 501,
        orderNumber: 'E2E-ORD-001',
        status: 'new',
        total: body.total ?? 62.5,
        ...body,
      }), 201);
    }

    if (method === 'GET' && path.startsWith('/products/') && path.endsWith('/frequently-bought')) {
      return json(route, ok([
        {
          id: '2',
          name: 'Boîte Cadeau Atlas',
          price: 28,
          images: ['/uploads/demo2.png'],
          category: 'boites',
          inStock: true,
          stockQuantity: 20,
          description: 'Boîte cadeau assortie',
        },
      ]));
    }

    if (method === 'GET' && path === '/store-global-sections/public') {
      return json(route, ok([
        {
          id: 1,
          sectionKey: 'mega_menu',
          enabled: true,
          config: {
            items: [
              {
                label: 'Emballages',
                href: '/boutique',
                children: [
                  { label: 'Sachets kraft', href: '/boutique?keyword=kraft' },
                  { label: 'Boîtes cadeau', href: '/boutique?keyword=boite' },
                ],
              },
              { label: 'Contact', href: '/contact' },
            ],
          },
        },
        {
          id: 2,
          sectionKey: 'footer_links',
          enabled: true,
          config: {
            columns: [
              {
                title: 'Boutique',
                links: [
                  { label: 'Tous les produits', href: '/boutique' },
                  { label: 'Codes promo', href: '/codes-promo' },
                ],
              },
              {
                title: 'Aide',
                links: [
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Nous contacter', href: '/contact' },
                ],
              },
            ],
          },
        },
        {
          id: 3,
          sectionKey: 'sticky_cta',
          enabled: true,
          config: {
            text: 'Livraison gratuite dès 750 MAD',
            ctaLabel: 'Voir la boutique',
            ctaHref: '/boutique',
            dismissible: true,
          },
        },
      ]));
    }

    if (method === 'GET' && path === '/product-reviews/public/1') {
      return json(route, ok({
        productId: 1,
        averageRating: 5,
        reviewCount: 1,
      }));
    }

    if (method === 'GET' && path === '/product-reviews/public/1/reviews') {
      return json(route, ok({
        content: [
          {
            id: 10,
            productId: 1,
            authorName: 'Nadia',
            rating: 5,
            title: 'Top qualité',
            body: 'Emballage parfait pour mes commandes.',
            approved: true,
            createdAt: new Date().toISOString(),
          },
        ],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
      }));
    }

    if (method === 'POST' && path === '/product-reviews/public') {
      return json(route, ok({
        id: 11,
        productId: 1,
        authorName: 'Nouveau',
        rating: 5,
        body: 'Avis test',
        approved: false,
        createdAt: new Date().toISOString(),
      }));
    }

    if (method === 'GET' && path === '/promo-codes/suggestions') {
      return json(route, ok([]));
    }

    if (method === 'GET' && path === '/promo-codes/validate') {
      return json(route, ok({ valid: false, message: 'Code invalide' }));
    }

    if (method === 'POST' && path === '/abandoned-carts/public/capture') {
      const body = (req.postDataJSON() as Record<string, unknown>) || {};
      return json(route, ok({
        ...abandonedCartDemo,
        customerEmail: body.customerEmail ?? abandonedCartDemo.customerEmail,
        customerPhone: body.customerPhone ?? abandonedCartDemo.customerPhone,
        customerName: body.customerName ?? abandonedCartDemo.customerName,
        sessionKey: body.sessionKey ?? abandonedCartDemo.sessionKey,
        cartTotal: body.cartTotal ?? abandonedCartDemo.cartTotal,
      }));
    }

    if (method === 'GET' && path.startsWith('/abandoned-carts/public/recover/')) {
      return json(route, ok(abandonedCartDemo));
    }

    if (method === 'POST' && path === '/abandoned-carts/public/recovered') {
      return json(route, ok(null));
    }

    if (method === 'GET' && path === '/abandoned-carts') {
      return json(route, ok([abandonedCartDemo]));
    }

    if (method === 'GET' && path === '/custom-orders') {
      return json(route, ok({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true }));
    }

    if (method === 'GET' && path === '/stats/dashboard') {
      return json(route, ok({
        productCount: 1,
        orderCount: 0,
        newOrderCount: 0,
        customOrderCount: 0,
        pendingCustomOrderCount: 0,
        deliveredRevenue: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      }));
    }

    if (method === 'GET' && path === '/stock/overview') {
      return json(route, ok({ totalVariants: 1, lowStock: 0, outOfStock: 0, stockValue: 100 }));
    }

    if (method === 'GET' && path === '/admin/members') {
      return json(route, ok([]));
    }

    if (method === 'GET' && path === '/admin/audit') {
      return json(route, ok({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 }));
    }

    if (method === 'GET' && path.startsWith('/cart')) {
      return json(route, { id: 1, sessionId: 'e2e', items: [], totalAmount: 0 });
    }

    if (method === 'GET' && path.startsWith('/wishlist/')) {
      return json(route, []);
    }

    if (method === 'GET' && path === '/home-hero/public') {
      return json(route, ok({ enabled: true, title: 'Bienvenue', subtitle: 'Atlas' }));
    }

    if (method === 'GET' && path === '/store-blog/public') {
      return json(route, ok([
        {
          id: 1,
          title: 'Guide emballage',
          slug: 'guide-emballage',
          excerpt: 'Astuces pour emballer vos commandes',
          content: 'Contenu article de démo.',
          lang: 'fr',
          published: true,
        },
      ]));
    }

    if (method === 'GET' && path === '/store-blog/public/guide-emballage') {
      return json(route, ok({
        id: 1,
        title: 'Guide emballage',
        slug: 'guide-emballage',
        excerpt: 'Astuces',
        content: 'Contenu article de démo pour les tests E2E.',
        lang: 'fr',
        published: true,
      }));
    }

    // Fallback soft : évite de casser le front sur endpoints secondaires
    // (ne pas avaler /product-reviews/public/... déjà gérés plus haut)
    if (method === 'GET' && (path.endsWith('/public') || path.includes('/public'))
        && !path.includes('/product-reviews/')) {
      return json(route, ok([]));
    }

    if (method === 'GET' && path === '/store-pages') {
      return json(route, ok([
        {
          id: 1,
          title: 'Accueil A',
          slug: 'home-a',
          isHome: true,
          showInNav: false,
          published: true,
          sortOrder: 0,
          abVariant: 'A',
          currentlyLive: true,
          blocks: [],
        },
      ]));
    }

    if (method === 'GET' && path === '/store-pages/analytics') {
      return json(route, ok([{ pageId: 1, pageTitle: 'Accueil A', pageSlug: 'home-a', abVariant: 'A', views: 12, ctaClicks: 3 }]));
    }

    if (method === 'GET' && path === '/store-webhooks') {
      return json(route, ok([]));
    }

    if (method === 'GET' && path === '/store-webhooks/deliveries') {
      return json(route, ok([]));
    }

    if (method === 'GET' && path === '/store-global-sections') {
      return json(route, ok([
        { id: 1, sectionKey: 'mega_menu', enabled: false, config: { items: [] } },
        { id: 2, sectionKey: 'footer_links', enabled: false, config: { columns: [] } },
        { id: 3, sectionKey: 'sticky_cta', enabled: false, config: {} },
      ]));
    }

    if (method === 'GET' && path === '/store-blog') {
      return json(route, ok([]));
    }

    if (method === 'GET' && path === '/store-leads') {
      return json(route, ok([]));
    }

    if (method === 'GET' && path === '/product-reviews') {
      return json(route, ok([]));
    }

    if (method === 'GET' && (path === '/sitemap.xml' || path === '/seo/sitemap.xml')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/xml',
        body: '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>http://127.0.0.1/boutique</loc></url></urlset>',
      });
    }

    if (method === 'GET' && (path === '/robots.txt' || path === '/seo/robots.txt')) {
      return route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'User-agent: *\nAllow: /\nSitemap: http://127.0.0.1/sitemap.xml\n',
      });
    }

    if (method === 'GET' && path === '/platform/fournisseurs') {
      return json(route, ok([{
        id: 10,
        name: 'Maison Atlas',
        slug: 'maison-atlas',
        status: 'ACTIVE',
        planCode: 'basic',
        planName: 'Basic',
        planPriceMad: 79,
      }]));
    }

    // Fallback soft : évite de casser le front sur endpoints secondaires
    if (method === 'GET') {
      return json(route, ok([]));
    }

    return json(route, ok(null));
  });
}
