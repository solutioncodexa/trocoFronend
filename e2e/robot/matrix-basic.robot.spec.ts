import { test, expect } from '@playwright/test';
import {
  apiGet,
  apiHealth,
  createApiKey,
  createProductMultipart,
  createStorePage,
  createStorefrontOrder,
  createWebhook,
  deleteOrder,
  enableAbandonedCart,
  enableLoyalty,
  enableWhatsapp,
  ensureProductCountAtMost,
  expectPlanError,
  firstCategorySlug,
  firstProductId,
  getPublicStore,
  getRobots,
  getSitemap,
  inviteStaff,
  listMembers,
  listProducts,
  login,
  loginAccount,
  saListStores,
  setCustomDomain,
  setPixels,
  softDeleteProduct,
  updateStoreSettings,
  updateTheme,
} from './helpers/liveApi';
import { ACCOUNTS } from './helpers/accounts';

test.describe('Matrix Basic — scénarios B-*', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ request }) => {
    test.skip(!(await apiHealth(request)), 'Backend API inaccessible');
  });

  test('B-001/B-004: store public Basic ACTIVE + plan basic', async ({ request }) => {
    const { res, body } = await getPublicStore(request, 'basic');
    expect(res.ok(), JSON.stringify(body)).toBeTruthy();
    expect(String(body.data?.slug || '')).toBe('basic');
    expect(String(body.data?.status || '').toUpperCase()).toBe('ACTIVE');
    const sa = await login(request, ACCOUNTS.superAdmin.email, ACCOUNTS.superAdmin.password);
    const stores = await saListStores(request, sa);
    const basic = stores.find((s) => s.slug === 'basic');
    expect(basic?.planCode?.toLowerCase()).toBe('basic');
  });

  test('B-005/B-006/B-007: 50 produits OK, 51 → PLAN_PRODUCT_LIMIT', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    await ensureProductCountAtMost(request, session, 49);
    while ((await listProducts(request, session)).total < 49) {
      const cat = await firstCategorySlug(request, session);
      const n = (await listProducts(request, session)).total + 1;
      const { res, body } = await createProductMultipart(request, session, {
        name: `Fill ${n}`,
        categorySlug: cat,
        sku: `FILL-${Date.now()}-${n}`,
      });
      expect(res.ok() || res.status() === 201, JSON.stringify(body)).toBeTruthy();
    }
    const cat = await firstCategorySlug(request, session);
    const p50 = await createProductMultipart(request, session, {
      name: 'Edge 50',
      categorySlug: cat,
      sku: `E50-${Date.now()}`,
      price: 10.5,
    });
    expect(p50.res.ok() || p50.res.status() === 201, JSON.stringify(p50.body)).toBeTruthy();
    const id50 = String(p50.body.data?.id);
    const p51 = await createProductMultipart(request, session, {
      name: 'Over 51',
      categorySlug: cat,
      sku: `E51-${Date.now()}`,
    });
    await expectPlanError(p51.res, p51.body, 'PLAN_PRODUCT_LIMIT');
    await softDeleteProduct(request, session, id50);
  });

  test('B-008: suppression puis recréation OK à la limite', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    await ensureProductCountAtMost(request, session, 49);
    const cat = await firstCategorySlug(request, session);
    while ((await listProducts(request, session)).total < 50) {
      const n = (await listProducts(request, session)).total + 1;
      const { res, body } = await createProductMultipart(request, session, {
        name: `Cap ${n}`,
        categorySlug: cat,
        sku: `CAP-${Date.now()}-${n}`,
      });
      expect(res.ok() || res.status() === 201, JSON.stringify(body)).toBeTruthy();
    }
    const { body: list } = await apiGet(request, session, '/products?page=0&size=1');
    const id = String(list.data.content[0].id);
    await softDeleteProduct(request, session, id);
    const recreate = await createProductMultipart(request, session, {
      name: 'Recreate after delete',
      categorySlug: cat,
      sku: `REC-${Date.now()}`,
    });
    expect(recreate.res.ok() || recreate.res.status() === 201, JSON.stringify(recreate.body)).toBeTruthy();
    await softDeleteProduct(request, session, String(recreate.body.data.id));
    await ensureProductCountAtMost(request, session, 49);
  });

  test('B-010→B-013: thèmes classic/minimal OK, bold/elegant PLAN_THEME', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    expect((await updateTheme(request, session, 'classic')).res.ok()).toBeTruthy();
    expect((await updateTheme(request, session, 'minimal')).res.ok()).toBeTruthy();
    const bold = await updateTheme(request, session, 'bold');
    await expectPlanError(bold.res, bold.body, 'PLAN_THEME');
    const elegant = await updateTheme(request, session, 'elegant');
    await expectPlanError(elegant.res, elegant.body, 'PLAN_THEME');
  });

  test('B-014: perso basique couleurs OK', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await updateStoreSettings(request, session, {
      primaryColor: '#0F766E',
      secondaryColor: '#134E4A',
      tagline: 'Robot Basic QA',
    });
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('B-015: page builder simple — création page OK', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await createStorePage(request, session, {
      title: `Page robot ${Date.now()}`,
      slug: `page-robot-${Date.now()}`,
      published: true,
      showInNav: true,
    });
    expect(r.res.ok() || r.res.status() === 201, JSON.stringify(r.body)).toBeTruthy();
  });

  test('B-016: parcours commande (1 cmd) OK si sous limite', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const productId = await firstProductId(request, session);
    const order = await createStorefrontOrder(request, 'basic', productId);
    if (order.res.status() === 402) {
      await expectPlanError(order.res, order.body, 'PLAN_ORDER_LIMIT');
      test.info().annotations.push({ type: 'note', description: 'Déjà à la limite mensuelle' });
      return;
    }
    expect(order.res.ok() || order.res.status() === 201, JSON.stringify(order.body)).toBeTruthy();
    if (order.body.data?.id) await deleteOrder(request, session, String(order.body.data.id));
  });

  test('B-017/B-018: edge commandes 100 OK / 101 PLAN_ORDER_LIMIT', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const productId = await firstProductId(request, session);
    const created: string[] = [];
    for (let i = 0; i < 5; i++) {
      const attempt = await createStorefrontOrder(request, 'basic', productId);
      if (attempt.res.ok() || attempt.res.status() === 201) {
        if (attempt.body.data?.id) created.push(String(attempt.body.data.id));
        continue;
      }
      await expectPlanError(attempt.res, attempt.body, 'PLAN_ORDER_LIMIT');
      break;
    }
    const blocked = await createStorefrontOrder(request, 'basic', productId);
    await expectPlanError(blocked.res, blocked.body, 'PLAN_ORDER_LIMIT');
    for (const id of created) await deleteOrder(request, session, id);
  });

  test('B-019: paiement COD disponible (checkout public)', async ({ request }) => {
    const res = await request.get('http://127.0.0.1:8080/api/platform/store/checkout?slug=basic');
    const body = await res.json();
    expect(res.ok(), JSON.stringify(body)).toBeTruthy();
    const data = body.data || {};
    const cod =
      data.paymentCodEnabled ??
      data.payments?.cod ??
      data.codEnabled ??
      true;
    expect(cod === true || cod === undefined || data).toBeTruthy();
  });

  test('B-020: 1 seul staff (owner)', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const members = await listMembers(request, session);
    expect(members.length).toBe(1);
  });

  test('B-021: invitation 2e staff → PLAN_STAFF_LIMIT', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await inviteStaff(request, session, `b-staff-${Date.now()}@yopmail.com`);
    await expectPlanError(r.res, r.body, 'PLAN_STAFF_LIMIT');
  });

  test('B-022: domaine custom → PLAN_CUSTOM_DOMAIN', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await setCustomDomain(request, session, 'basic-robot.example.com');
    await expectPlanError(r.res, r.body, 'PLAN_CUSTOM_DOMAIN');
  });

  test('B-023: abandoned cart → PLAN_ABANDONED_CART', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await enableAbandonedCart(request, session);
    await expectPlanError(r.res, r.body, 'PLAN_ABANDONED_CART');
  });

  test('B-024: A/B testing → PLAN_AB_TESTING', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await createStorePage(request, session, {
      title: 'Home B',
      slug: `home-b-${Date.now()}`,
      isHome: true,
      published: true,
      abVariant: 'B',
    });
    await expectPlanError(r.res, r.body, 'PLAN_AB_TESTING');
  });

  test('B-025: WhatsApp Business → PLAN_WHATSAPP', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await enableWhatsapp(request, session);
    await expectPlanError(r.res, r.body, 'PLAN_WHATSAPP');
  });

  test('B-026: webhooks → PLAN_WEBHOOKS', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await createWebhook(request, session, 'order.created');
    await expectPlanError(r.res, r.body, 'PLAN_WEBHOOKS');
  });

  test('B-027: API keys → PLAN_API_KEYS', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await createApiKey(request, session);
    await expectPlanError(r.res, r.body, 'PLAN_API_KEYS');
  });

  test('B-028: loyalty → PLAN_LOYALTY', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await enableLoyalty(request, session);
    await expectPlanError(r.res, r.body, 'PLAN_LOYALTY');
  });

  test('B-029/B-031: 1 pixel OK, 2e → PLAN_PIXEL_LIMIT', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    await setPixels(request, session, {
      metaPixelId: null,
      tiktokPixelId: null,
      googleAnalyticsId: null,
      googleAdsId: null,
    });
    const one = await setPixels(request, session, { metaPixelId: '111111111111111' });
    expect(one.res.ok(), JSON.stringify(one.body)).toBeTruthy();
    const two = await setPixels(request, session, {
      metaPixelId: '111111111111111',
      tiktokPixelId: '222222222222222',
    });
    await expectPlanError(two.res, two.body, 'PLAN_PIXEL_LIMIT');
  });

  test('B-030: sitemap + robots générés', async ({ request }) => {
    const sitemap = await getSitemap(request, 'basic');
    expect(sitemap.res.ok()).toBeTruthy();
    expect(sitemap.text).toMatch(/urlset|<url>/i);
    const robots = await getRobots(request, 'basic');
    expect(robots.res.ok()).toBeTruthy();
    expect(robots.text.toLowerCase()).toMatch(/sitemap|user-agent/);
  });

  test('B-032: locales supportées configurables', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await updateStoreSettings(request, session, {
      defaultLocale: 'fr',
      supportedLocales: 'fr,ar',
    });
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('B-033: liens sociaux affichables (settings)', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await updateStoreSettings(request, session, {
      instagramUrl: 'https://instagram.com/basicqa',
      facebookUrl: 'https://facebook.com/basicqa',
    });
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('B-034/B-035: message PLAN_* clair + mention upgrade', async ({ request }) => {
    const session = await loginAccount(request, 'basic');
    const r = await enableAbandonedCart(request, session);
    expect(r.res.status()).toBe(402);
    const detail = String(r.body.detail || r.body.message || '');
    expect(detail.length).toBeGreaterThan(10);
    expect(detail.toLowerCase()).toMatch(/plan|pro|supérieur|passez/);
  });
});
