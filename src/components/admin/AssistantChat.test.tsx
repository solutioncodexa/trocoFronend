import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AssistantChat } from './AssistantChat';
import { adminMessages } from '@/i18n/admin/adminMessages';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';

// Parcours de conversation complets : lents sous la charge d'une suite parallèle.
vi.setConfig({ testTimeout: 20000 });

const fr = (key: AdminMessageKey, vars?: Record<string, string | number>) => {
  let raw = adminMessages.fr[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) raw = raw.replace(`{${k}}`, String(v));
  return raw;
};

const api = vi.hoisted(() => ({
  status: vi.fn(),
  chat: vi.fn(),
  getAllCategories: vi.fn(),
  createCategory: vi.fn(),
  createProduct: vi.fn(),
  generate: vi.fn(),
  getMyStoreSettings: vi.fn(),
  updateMyStoreSettings: vi.fn(),
  uploadImage: vi.fn(),
}));

vi.mock('@/contexts/AdminLocaleContext', () => ({
  useAdminLocale: () => ({ locale: 'fr', dir: 'ltr', setLocale: vi.fn(), t: fr }),
}));
vi.mock('@/contexts/TenantContext', () => ({
  useTenant: () => ({
    store: { siteName: 'Ma Boutique', planCode: 'basic' },
    refresh: vi.fn(),
    loadFromAdminSession: vi.fn(),
  }),
}));
vi.mock('@/services/api/assistant', () => ({ assistantApi: { status: api.status, chat: api.chat } }));
vi.mock('@/services/api/categories', () => ({
  categoriesApi: { getAllCategories: api.getAllCategories, createCategory: api.createCategory },
}));
vi.mock('@/services/api/products', () => ({ productsApi: { createProduct: api.createProduct } }));
vi.mock('@/services/api/aiCopy', () => ({ aiCopyApi: { generate: api.generate } }));
vi.mock('@/services/api/platform', () => ({
  platformApi: { getMyStoreSettings: api.getMyStoreSettings, updateMyStoreSettings: api.updateMyStoreSettings },
}));
vi.mock('@/services/api/upload', () => ({ uploadImage: api.uploadImage }));
vi.mock('@/utils/compressImage', () => ({
  compressImageWithReport: async (file: File) => ({ file, report: {} }),
}));

function renderChat() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AssistantChat />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const openChat = async () => {
  fireEvent.click(await screen.findByRole('button', { name: fr('assistant.openAria') }));
};
const click = async (name: string | RegExp) => fireEvent.click(await screen.findByRole('button', { name }));

describe('AssistantChat — catalogue guidé', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    // jsdom n'implémente pas scrollIntoView (les navigateurs, si).
    Element.prototype.scrollIntoView = vi.fn();
    api.status.mockResolvedValue({ enabled: true });
    api.getAllCategories.mockResolvedValue([]);
    let id = 0;
    api.createCategory.mockImplementation(async (c: { name: string; slug: string; parentId?: number }) => ({
      id: ++id,
      name: c.name,
      slug: c.slug,
      parentId: c.parentId ?? null,
    }));
    api.createProduct.mockResolvedValue({ id: '1' });
    api.generate.mockResolvedValue({ text: 'Une belle description proposée.' });
  });

  it('reste invisible quand l’assistant est désactivé', async () => {
    api.status.mockResolvedValue({ enabled: false });
    renderChat();
    await waitFor(() => expect(api.status).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: fr('assistant.openAria') })).toBeNull();
  });

  it('crée catégories, sous-catégories puis un article, en posant les questions', async () => {
    renderChat();
    await openChat();
    await click(fr('assistant.catalog.start'));

    // 1. Activité → modèle de catégories proposé
    expect(await screen.findByText(fr('assistant.catalog.activity.ask'))).toBeTruthy();
    await click(fr('assistant.catalog.activity.fashion'));
    expect(await screen.findByText(fr('assistant.catalog.tree.ask'))).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'Femme' })).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'Robes' })).toBeTruthy();

    // 2. Le commerçant décoche « Homme » (et ses enfants restent proposés mais le parent est décoché)
    for (const name of ['Homme', 'Chemises', 'Pantalons', 'Chaussures', 'Djellabas & jabadors', 'Babouches']) {
      fireEvent.click(screen.getByRole('checkbox', { name }));
    }

    await click(fr('assistant.catalog.tree.create'));
    await waitFor(() => expect(api.createCategory).toHaveBeenCalled());

    const created = api.createCategory.mock.calls.map((c) => c[0] as { slug: string; parentId?: number });
    const slugs = created.map((c) => c.slug);
    expect(slugs).toContain('femme');
    expect(slugs).toContain('femme-robes');
    expect(slugs).not.toContain('homme');
    expect(slugs).not.toContain('homme-chemises');
    // la sous-catégorie est bien rattachée à son parent (créé avant)
    const femmeId = 1;
    expect(created.find((c) => c.slug === 'femme-robes')?.parentId).toBe(femmeId);
    expect(created.find((c) => c.slug === 'femme')?.parentId).toBeUndefined();

    // 3. Article : catégorie, nom, prix, photos (passées), description proposée, stock, confirmation
    expect(await screen.findByText(fr('assistant.catalog.product.ask'))).toBeTruthy();
    await click(fr('assistant.flow.yes'));
    expect(await screen.findByText(fr('assistant.catalog.product.category'))).toBeTruthy();
    await click('Femme › Robes');

    fireEvent.change(await screen.findByPlaceholderText(fr('assistant.catalog.product.namePlaceholder')), {
      target: { value: 'Robe d’été' },
    });
    await click(fr('assistant.flow.save'));

    expect(await screen.findByText(fr('assistant.catalog.product.price'))).toBeTruthy();
    await click('200'); // suggestion de prix

    expect(await screen.findByText(fr('assistant.catalog.product.photos'))).toBeTruthy();
    await click(fr('assistant.flow.skip'));

    expect(await screen.findByText('Une belle description proposée.')).toBeTruthy();
    expect(api.generate).toHaveBeenCalledWith(expect.objectContaining({ topic: 'Robe d’été', storeName: 'Ma Boutique' }));
    await click(fr('assistant.catalog.product.descUse'));

    expect(await screen.findByText(fr('assistant.catalog.product.stock'))).toBeTruthy();
    await click('10'); // suggestion de stock

    expect(await screen.findByText(fr('assistant.catalog.product.confirm'))).toBeTruthy();
    await click(fr('assistant.catalog.product.create'));

    await waitFor(() => expect(api.createProduct).toHaveBeenCalledTimes(1));
    const [payload, files] = api.createProduct.mock.calls[0];
    expect(payload).toEqual({
      name: 'Robe d’été',
      description: 'Une belle description proposée.',
      price: 200,
      category: 'femme-robes',
      stockQuantity: 10,
    });
    expect(files).toEqual([]);

    expect(await screen.findByText(fr('assistant.catalog.product.another'))).toBeTruthy();
    await click(fr('assistant.flow.no'));
    expect(await screen.findByText(fr('assistant.catalog.done'))).toBeTruthy();
  });

  it('refuse un nom trop court sans rien créer', async () => {
    api.getAllCategories.mockResolvedValue([{ id: 1, name: 'Femme', slug: 'femme', parentId: null }]);
    renderChat();
    await openChat();
    await click(fr('assistant.catalog.start'));
    await screen.findByText(/1 catégorie/);
    await click(fr('assistant.flow.no')); // pas d'autres catégories
    await click(fr('assistant.flow.yes')); // ajouter un article
    await click('Femme');
    fireEvent.change(await screen.findByPlaceholderText(fr('assistant.catalog.product.namePlaceholder')), {
      target: { value: 'ab' },
    });
    await click(fr('assistant.flow.save'));
    expect(await screen.findByText(fr('assistant.flow.invalid'))).toBeTruthy();
    expect(api.createProduct).not.toHaveBeenCalled();
  });

  it('affiche l’erreur du serveur et garde l’article à confirmer (ex. limite du plan)', async () => {
    api.getAllCategories.mockResolvedValue([{ id: 1, name: 'Femme', slug: 'femme', parentId: null }]);
    api.createProduct.mockRejectedValue(new Error('Limite atteinte : votre plan Basic autorise 50 produits.'));
    renderChat();
    await openChat();
    await click(fr('assistant.catalog.start'));
    await screen.findByText(/1 catégorie/);
    await click(fr('assistant.flow.no'));
    await click(fr('assistant.flow.yes'));
    await click('Femme');
    fireEvent.change(await screen.findByPlaceholderText(fr('assistant.catalog.product.namePlaceholder')), {
      target: { value: 'Caftan royal' },
    });
    await click(fr('assistant.flow.save'));
    await click('100');
    await click(fr('assistant.flow.skip')); // photos
    await click(fr('assistant.catalog.product.descUse'));
    await click(fr('assistant.flow.skip')); // stock
    await click(fr('assistant.catalog.product.create'));

    expect(await screen.findByText(/Limite atteinte : votre plan Basic autorise 50 produits\./)).toBeTruthy();
    // l'écran de confirmation reste actif pour réessayer
    expect(screen.getByRole('button', { name: fr('assistant.catalog.product.create') })).toBeTruthy();
  });
});
