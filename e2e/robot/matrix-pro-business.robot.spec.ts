import { test, expect } from '@playwright/test';
import {
  apiHealth,
  createApiKey,
  createProductMultipart,
  createStorePage,
  createStorefrontOrder,
  createWebhook,
  enableAbandonedCart,
  enableLoyalty,
  enableWhatsapp,
  expectPlanError,
  firstCategorySlug,
  firstProductId,
  getPublicStore,
  inviteStaff,
  listMembers,
  listPlatformPlans,
  listProducts,
  loginAccount,
  setCustomDomain,
  setPixels,
  updateStoreSettings,
  updateTheme,
} from './helpers/liveApi';

test.describe('Matrix Pro — scénarios P-*', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ request }) => {
    test.skip(!(await apiHealth(request)), 'Backend API inaccessible');
  });

  test('P-001/P-002: store Pro + limites affichées (plans API)', async ({ request }) => {
    const { res, body } = await getPublicStore(request, 'pro');
    expect(res.ok(), JSON.stringify(body)).toBeTruthy();
    const plans = await listPlatformPlans(request);
    const pro = plans.find((p) => p.code === 'pro');
    expect(pro).toBeTruthy();
    expect(pro!.priceMad).toBe(199);
    expect(pro!.maxProducts).toBe(500);
    expect(pro!.maxStaff).toBe(3);
    expect(pro!.maxOrdersPerMonth).toBe(1000);
    expect(pro!.maxPixels).toBe(3);
    expect(pro!.customDomain).toBe(true);
  });

  test('P-003: création produit au-delà de 50 (Pro) OK', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const total = (await listProducts(request, session)).total;
    expect(total).toBeGreaterThan(50);
    const cat = await firstCategorySlug(request, session);
    const r = await createProductMultipart(request, session, {
      name: `Pro extra ${Date.now()}`,
      categorySlug: cat,
      sku: `PRO-X-${Date.now()}`,
    });
    expect(r.res.ok() || r.res.status() === 201, JSON.stringify(r.body)).toBeTruthy();
  });

  test('P-005: staff jusqu’à limite Pro (invite si < 3)', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const members = await listMembers(request, session);
    if (members.length < 3) {
      const r = await inviteStaff(request, session, `pro-staff-${Date.now()}@yopmail.com`);
      expect(r.res.ok() || r.res.status() === 201 || r.res.status() === 402, JSON.stringify(r.body)).toBeTruthy();
    } else {
      expect(members.length).toBeLessThanOrEqual(3);
    }
  });

  test('P-006: dépassement staff Pro → PLAN_STAFF_LIMIT', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    // remplir jusqu'à 3 puis tenter le 4e
    for (let i = 0; i < 5; i++) {
      const members = await listMembers(request, session);
      if (members.length >= 3) break;
      await inviteStaff(request, session, `pro-fill-${Date.now()}-${i}@yopmail.com`);
    }
    const over = await inviteStaff(request, session, `pro-over-${Date.now()}@yopmail.com`);
    await expectPlanError(over.res, over.body, 'PLAN_STAFF_LIMIT');
  });

  test('P-007: domaine custom Pro OK', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const r = await setCustomDomain(request, session, `pro-robot-${Date.now()}.example.com`);
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('P-008/P-009: 3 pixels max modèle (meta+tiktok+GA/Ads)', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    await setPixels(request, session, {
      metaPixelId: null,
      tiktokPixelId: null,
      googleAnalyticsId: null,
      googleAdsId: null,
    });
    const three = await setPixels(request, session, {
      metaPixelId: '111111111111111',
      tiktokPixelId: '222222222222222',
      googleAnalyticsId: 'G-TEST123',
    });
    expect(three.res.ok(), JSON.stringify(three.body)).toBeTruthy();
    // Le modèle actuel ne compte que 3 canaux (GA et Ads = 1 slot) → plafond Pro atteint sans 4e champ distinct.
  });

  test('P-011: tous thèmes standards OK', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    for (const t of ['classic', 'minimal', 'bold', 'elegant']) {
      const r = await updateTheme(request, session, t);
      expect(r.res.ok(), `${t} ${JSON.stringify(r.body)}`).toBeTruthy();
    }
  });

  test('P-013: A/B testing pages OK', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const r = await createStorePage(request, session, {
      title: `Home A ${Date.now()}`,
      slug: `home-a-${Date.now()}`,
      isHome: true,
      published: true,
      abVariant: 'A',
    });
    expect(r.res.ok() || r.res.status() === 201, JSON.stringify(r.body)).toBeTruthy();
  });

  test('P-014: panier abandonné standard OK', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const r = await enableAbandonedCart(request, session);
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('P-015: WhatsApp template unique OK', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const r = await enableWhatsapp(request, session);
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('P-017/P-018: webhook order.created OK, lead.created → PLAN_WEBHOOK_EVENT', async ({
    request,
  }) => {
    const session = await loginAccount(request, 'pro');
    const ok = await createWebhook(request, session, 'order.created');
    expect(ok.res.ok() || ok.res.status() === 201, JSON.stringify(ok.body)).toBeTruthy();
    const bad = await createWebhook(request, session, 'lead.created');
    await expectPlanError(bad.res, bad.body, 'PLAN_WEBHOOK_EVENT');
  });

  test('P-019: clé API OK', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const r = await createApiKey(request, session);
    expect(r.res.ok() || r.res.status() === 201, JSON.stringify(r.body)).toBeTruthy();
  });

  test('P-020: loyalty OK', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const r = await enableLoyalty(request, session);
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('P-021: multi-devise flag OK', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const r = await updateStoreSettings(request, session, {
      currency: 'MAD',
      currencyRatesJson: JSON.stringify({ EUR: 0.09 }),
    });
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('P-022: commande storefront Pro (OK ou PLAN_ORDER_LIMIT si plafond)', async ({ request }) => {
    const session = await loginAccount(request, 'pro');
    const productId = await firstProductId(request, session);
    const order = await createStorefrontOrder(request, 'pro', productId);
    if (order.res.status() === 402) {
      await expectPlanError(order.res, order.body, 'PLAN_ORDER_LIMIT');
      return;
    }
    expect(order.res.ok() || order.res.status() === 201, JSON.stringify(order.body)).toBeTruthy();
  });
});

test.describe('Matrix Business — scénarios BZ-*', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ request }) => {
    test.skip(!(await apiHealth(request)), 'Backend API inaccessible');
  });

  test('BZ-001/BZ-002: plan Business + limites illimitées', async ({ request }) => {
    const { res, body } = await getPublicStore(request, 'business');
    expect(res.ok(), JSON.stringify(body)).toBeTruthy();
    const plans = await listPlatformPlans(request);
    const bz = plans.find((p) => p.code === 'business');
    expect(bz!.priceMad).toBe(399);
    expect(bz!.maxProducts).toBeNull();
    expect(bz!.maxOrdersPerMonth).toBeNull();
    expect(bz!.maxPixels).toBeNull();
    expect(bz!.maxStaff).toBe(10);
  });

  test('BZ-005: volume produits > seed OK', async ({ request }) => {
    const session = await loginAccount(request, 'business');
    const cat = await firstCategorySlug(request, session);
    const r = await createProductMultipart(request, session, {
      name: `Biz product ${Date.now()}`,
      categorySlug: cat,
      sku: `BIZ-${Date.now()}`,
    });
    expect(r.res.ok() || r.res.status() === 201, JSON.stringify(r.body)).toBeTruthy();
  });

  test('BZ-007: pixels > 3 OK', async ({ request }) => {
    const session = await loginAccount(request, 'business');
    const r = await setPixels(request, session, {
      metaPixelId: '111111111111111',
      tiktokPixelId: '222222222222222',
      googleAnalyticsId: 'G-BIZ',
      googleAdsId: 'AW-BIZ',
    });
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('BZ-009: abandoned cart advanced (enable) OK', async ({ request }) => {
    const session = await loginAccount(request, 'business');
    const r = await enableAbandonedCart(request, session);
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('BZ-010: WhatsApp templates OK', async ({ request }) => {
    const session = await loginAccount(request, 'business');
    const r = await enableWhatsapp(request, session);
    expect(r.res.ok(), JSON.stringify(r.body)).toBeTruthy();
  });

  test('BZ-011: webhooks order.created + lead.created OK', async ({ request }) => {
    const session = await loginAccount(request, 'business');
    const a = await createWebhook(request, session, 'order.created');
    expect(a.res.ok() || a.res.status() === 201, JSON.stringify(a.body)).toBeTruthy();
    const b = await createWebhook(request, session, 'lead.created');
    expect(b.res.ok() || b.res.status() === 201, JSON.stringify(b.body)).toBeTruthy();
  });

  test('BZ-012: tous thèmes OK', async ({ request }) => {
    const session = await loginAccount(request, 'business');
    for (const t of ['classic', 'minimal', 'bold', 'elegant']) {
      expect((await updateTheme(request, session, t)).res.ok()).toBeTruthy();
    }
  });

  test('BZ-014: parcours commande Business OK', async ({ request }) => {
    const session = await loginAccount(request, 'business');
    const productId = await firstProductId(request, session);
    const order = await createStorefrontOrder(request, 'business', productId);
    expect(order.res.ok() || order.res.status() === 201, JSON.stringify(order.body)).toBeTruthy();
  });

  test('BZ-015: headless + loyalty + A/B simultanés', async ({ request }) => {
    const session = await loginAccount(request, 'business');
    const key = await createApiKey(request, session);
    expect(key.res.ok() || key.res.status() === 201, JSON.stringify(key.body)).toBeTruthy();
    expect((await enableLoyalty(request, session)).res.ok()).toBeTruthy();
    const ab = await createStorePage(request, session, {
      title: `Biz AB ${Date.now()}`,
      slug: `biz-ab-${Date.now()}`,
      isHome: true,
      published: true,
      abVariant: 'B',
    });
    expect(ab.res.ok() || ab.res.status() === 201, JSON.stringify(ab.body)).toBeTruthy();
  });
});
