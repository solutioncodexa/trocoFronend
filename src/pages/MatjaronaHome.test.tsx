import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import MatjaronaHome from './MatjaronaHome';

vi.mock('@/services/api/platform', () => ({
  platformApi: {
    getPlans: vi.fn().mockResolvedValue([
      {
        code: 'basic',
        name: 'Basic',
        priceMad: 79,
        description: 'Plan Basic',
        maxProducts: 50,
        maxStaff: 1,
        features: { themes: 'basic' },
      },
    ]),
  },
}));

vi.mock('@/contexts/AdminContext', () => ({
  useAdmin: () => ({
    isAuthenticated: false,
    isAdmin: false,
    isSuperAdmin: false,
    user: null,
    permissions: [],
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    hasPermission: () => false,
  }),
}));

vi.mock('@/contexts/TenantContext', () => ({
  useTenant: () => ({
    store: null,
    slug: null,
    isPlatformHost: true,
    isLoading: false,
    storeUnavailableMessage: null,
    refresh: vi.fn(),
    loadFromAdminSession: vi.fn(),
  }),
}));

describe('MatjaronaHome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche la marque et le CTA créer boutique', async () => {
    renderWithProviders(<MatjaronaHome />);

    expect(screen.getAllByText('Get STORE').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Créer ma boutique/i }).length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getAllByText(/79/).length).toBeGreaterThan(0);
    });
  });
});
