import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { ACCOUNTS, type AccountKey } from './accounts';

const API = process.env.ROBOT_API_BASE || 'http://127.0.0.1:8080/api';

/** PNG 1×1 minimal pour multipart produit (backend exige ≥1 image). */
const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

export type AuthSession = {
  token: string;
  fournisseurId: number | null;
  email: string;
  role: string;
  slug?: string;
};

async function parseJson(res: APIResponse): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function apiHealth(request: APIRequestContext): Promise<boolean> {
  try {
    const res = await request.get(`${API}/platform/plans`, { timeout: 8_000 });
    return res.ok();
  } catch {
    return false;
  }
}

export async function login(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<AuthSession> {
  let lastBody: any = null;
  let lastOk = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await request.post(`${API}/auth/login`, {
      data: { email, password },
    });
    lastBody = await parseJson(res);
    lastOk = res.ok();
    if (lastOk) break;
    await new Promise((r) => setTimeout(r, 800 * attempt));
  }
  expect(lastOk, `login ${email}: ${JSON.stringify(lastBody)}`).toBeTruthy();
  return {
    token: lastBody.data.access_token,
    fournisseurId: lastBody.data.fournisseur_id ?? null,
    email: lastBody.data.email,
    role: lastBody.data.role,
  };
}

export async function loginAccount(
  request: APIRequestContext,
  key: Exclude<AccountKey, 'superAdmin'>,
): Promise<AuthSession> {
  const acc = ACCOUNTS[key];
  const session = await login(request, acc.email, acc.password);
  return { ...session, slug: acc.slug };
}

function authHeaders(session: AuthSession, slug?: string): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${session.token}`,
  };
  const s = slug || session.slug;
  if (s) h['X-Fournisseur-Slug'] = s;
  if (session.fournisseurId != null) h['X-Fournisseur-Id'] = String(session.fournisseurId);
  return h;
}

export async function apiGet(
  request: APIRequestContext,
  session: AuthSession,
  path: string,
  slug?: string,
) {
  const res = await request.get(`${API}${path}`, { headers: authHeaders(session, slug) });
  const body = await parseJson(res);
  return { res, body };
}

export async function apiSend(
  request: APIRequestContext,
  session: AuthSession,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  data?: unknown,
  slug?: string,
) {
  const res = await request.fetch(`${API}${path}`, {
    method,
    headers: {
      ...authHeaders(session, slug),
      'Content-Type': 'application/json',
    },
    data,
  });
  const body = await parseJson(res);
  return { res, body };
}

/** Extrait le code erreur métier PLAN_* depuis une réponse API (ProblemDetail.title). */
export function planErrorCode(body: any): string | undefined {
  const candidates = [
    body?.title,
    body?.errorCode,
    body?.code,
    body?.data?.errorCode,
    body?.error?.code,
  ].filter(Boolean);
  for (const c of candidates) {
    if (typeof c === 'string' && c.startsWith('PLAN_')) return c;
  }
  if (typeof body?.detail === 'string') {
    const m = body.detail.match(/PLAN_[A-Z_]+/);
    if (m) return m[0];
  }
  if (typeof body?.message === 'string') {
    const m = body.message.match(/PLAN_[A-Z_]+/);
    if (m) return m[0];
  }
  return undefined;
}

export async function expectPlanError(
  res: APIResponse,
  body: any,
  code: string,
) {
  expect(res.status(), JSON.stringify(body)).toBe(402);
  const found =
    planErrorCode(body) ||
    JSON.stringify(body);
  expect(found, `attendu ${code} dans ${JSON.stringify(body)}`).toContain(code);
}

export async function listProducts(request: APIRequestContext, session: AuthSession) {
  const { res, body } = await apiGet(request, session, '/products?page=0&size=1');
  expect(res.ok(), JSON.stringify(body)).toBeTruthy();
  return {
    total: Number(body.data?.totalElements ?? 0),
    raw: body,
  };
}

export async function listOrders(request: APIRequestContext, session: AuthSession) {
  const { res, body } = await apiGet(request, session, '/orders?page=0&size=1');
  expect(res.ok(), JSON.stringify(body)).toBeTruthy();
  return {
    total: Number(body.data?.totalElements ?? body.data?.length ?? 0),
    raw: body,
  };
}

export async function firstCategorySlug(request: APIRequestContext, session: AuthSession) {
  const { res, body } = await apiGet(request, session, '/categories');
  expect(res.ok(), JSON.stringify(body)).toBeTruthy();
  const cats = body.data || [];
  expect(cats.length, 'aucune catégorie').toBeGreaterThan(0);
  return String(cats[0].slug);
}

export async function firstProductId(request: APIRequestContext, session: AuthSession) {
  const { res, body } = await apiGet(request, session, '/products?page=0&size=1');
  expect(res.ok(), JSON.stringify(body)).toBeTruthy();
  const id = body.data?.content?.[0]?.id;
  expect(id, 'aucun produit').toBeTruthy();
  return String(id);
}

export async function createProductMultipart(
  request: APIRequestContext,
  session: AuthSession,
  opts: { name: string; categorySlug: string; sku: string; price?: number },
) {
  const product = {
    name: opts.name,
    description: 'Produit créé par robot E2E',
    shortDescription: 'robot',
    price: opts.price ?? 12.5,
    category: opts.categorySlug,
    sku: opts.sku,
    stockQuantity: 10,
    customizable: false,
  };

  const res = await request.post(`${API}/products`, {
    headers: authHeaders(session),
    multipart: {
      product: {
        name: 'product',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(product)),
      },
      images: {
        name: 'robot.png',
        mimeType: 'image/png',
        buffer: TINY_PNG,
      },
    },
  });
  const body = await parseJson(res);
  return { res, body };
}

export async function softDeleteProduct(
  request: APIRequestContext,
  session: AuthSession,
  id: string,
) {
  return apiSend(request, session, 'DELETE', `/products/${id}`);
}

export async function updateTheme(
  request: APIRequestContext,
  session: AuthSession,
  themeKey: string,
) {
  return apiSend(request, session, 'PUT', '/store-settings/me', { themeKey });
}

export async function inviteStaff(
  request: APIRequestContext,
  session: AuthSession,
  email: string,
) {
  return apiSend(request, session, 'POST', '/admin/members', {
    email,
    password: 'Staff1234!',
    fullName: 'Staff Robot',
    active: true,
    permissions: ['PRODUCTS_VIEW'],
  });
}

export async function setCustomDomain(
  request: APIRequestContext,
  session: AuthSession,
  domain: string,
) {
  return apiSend(request, session, 'PUT', '/store-settings/me', {
    customDomain: domain,
  });
}

export async function createWebhook(
  request: APIRequestContext,
  session: AuthSession,
  event: string,
) {
  return apiSend(request, session, 'POST', '/store-webhooks', {
    name: `robot-${event}`,
    targetUrl: 'https://example.com/hooks/robot',
    secret: 'robot-secret',
    events: [event],
    enabled: true,
  });
}

export async function createApiKey(request: APIRequestContext, session: AuthSession) {
  return apiSend(request, session, 'POST', '/api-keys', {
    name: 'robot-key',
    scopes: 'read',
  });
}

export async function enableAbandonedCart(request: APIRequestContext, session: AuthSession) {
  return apiSend(request, session, 'PUT', '/store-settings/me', {
    abandonedCartEnabled: true,
    abandonedCartDelayMinutes: 60,
  });
}

export async function enableLoyalty(request: APIRequestContext, session: AuthSession) {
  return apiSend(request, session, 'PUT', '/store-settings/me', {
    loyaltyEnabled: true,
  });
}

export async function enableWhatsapp(request: APIRequestContext, session: AuthSession) {
  return apiSend(request, session, 'PUT', '/store-settings/me', {
    contactWhatsapp: '+212612345678',
    whatsappOrderTemplate: 'Bonjour, commande {productName} {url}',
  });
}

export async function setPixels(
  request: APIRequestContext,
  session: AuthSession,
  pixels: {
    metaPixelId?: string | null;
    tiktokPixelId?: string | null;
    googleAnalyticsId?: string | null;
    googleAdsId?: string | null;
  },
) {
  return apiSend(request, session, 'PUT', '/store-settings/me', pixels);
}

export async function updateStoreSettings(
  request: APIRequestContext,
  session: AuthSession,
  data: Record<string, unknown>,
) {
  return apiSend(request, session, 'PUT', '/store-settings/me', data);
}

export async function createStorePage(
  request: APIRequestContext,
  session: AuthSession,
  data: Record<string, unknown>,
) {
  return apiSend(request, session, 'POST', '/store-pages', data);
}

export async function listMembers(request: APIRequestContext, session: AuthSession) {
  const { res, body } = await apiGet(request, session, '/admin/members');
  expect(res.ok(), JSON.stringify(body)).toBeTruthy();
  return (body.data || []) as Array<{ id: number | string; email: string; role?: string }>;
}

export async function getPublicStore(request: APIRequestContext, slug: string) {
  const res = await request.get(`${API}/platform/store?slug=${encodeURIComponent(slug)}`);
  const body = await parseJson(res);
  return { res, body };
}

export async function getSitemap(request: APIRequestContext, slug: string) {
  const res = await request.get(`${API}/sitemap.xml`, {
    headers: { 'X-Fournisseur-Slug': slug },
  });
  const text = await res.text();
  return { res, text };
}

export async function getRobots(request: APIRequestContext, slug: string) {
  const res = await request.get(`${API}/robots.txt`, {
    headers: { 'X-Fournisseur-Slug': slug },
  });
  const text = await res.text();
  return { res, text };
}

export async function listPlatformPlans(request: APIRequestContext) {
  const res = await request.get(`${API}/platform/plans`);
  const body = await parseJson(res);
  expect(res.ok(), JSON.stringify(body)).toBeTruthy();
  return body.data as Array<{
    code: string;
    priceMad: number;
    maxProducts: number | null;
    maxStaff: number | null;
    maxOrdersPerMonth: number | null;
    maxPixels: number | null;
    customDomain: boolean;
  }>;
}

export async function saUpdateStorePlan(
  request: APIRequestContext,
  sa: AuthSession,
  fournisseurId: number,
  planCode: string,
) {
  return apiSend(request, sa, 'PATCH', `/platform/fournisseurs/${fournisseurId}/plan`, {
    planCode,
  });
}

export async function saUpdateStoreStatus(
  request: APIRequestContext,
  sa: AuthSession,
  fournisseurId: number,
  status: string,
) {
  return apiSend(request, sa, 'PATCH', `/platform/fournisseurs/${fournisseurId}/status`, {
    status,
  });
}

export async function saListStores(request: APIRequestContext, sa: AuthSession) {
  const { res, body } = await apiGet(request, sa, '/platform/fournisseurs');
  expect(res.ok(), JSON.stringify(body)).toBeTruthy();
  return body.data as Array<{
    id: number;
    slug: string;
    email: string;
    status: string;
    planCode: string;
  }>;
}

export async function ensureProductCountAtMost(
  request: APIRequestContext,
  session: AuthSession,
  max: number,
) {
  while ((await listProducts(request, session)).total > max) {
    const { body } = await apiGet(request, session, '/products?page=0&size=1');
    const id = body.data?.content?.[0]?.id;
    if (!id) break;
    await softDeleteProduct(request, session, String(id));
  }
}

export async function createStorefrontOrder(
  request: APIRequestContext,
  slug: string,
  productId: string,
) {
  const res = await request.post(`${API}/orders`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Fournisseur-Slug': slug,
    },
    data: {
      items: [
        {
          product: { id: productId },
          quantity: 1,
        },
      ],
      customer: {
        fullName: 'Client Robot',
        phone: `06${String(Date.now()).slice(-8)}${Math.floor(Math.random() * 90 + 10)}`,
        address: '1 Rue Robot',
        city: 'Casablanca',
        email: `robot-${Date.now()}-${Math.floor(Math.random() * 9999)}@yopmail.com`,
      },
      paymentMethod: 'cash_on_delivery',
    },
  });
  const body = await parseJson(res);
  return { res, body };
}

export async function deleteOrder(
  request: APIRequestContext,
  session: AuthSession,
  id: string,
) {
  return apiSend(request, session, 'DELETE', `/orders/${id}`);
}
