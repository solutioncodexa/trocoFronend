import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import HomeRoute from './HomeRoute';

vi.mock('@/contexts/TenantContext', () => ({
  useTenant: vi.fn(),
}));

vi.mock('@/pages/Index', () => ({
  default: () => <div>Storefront Index</div>,
}));

vi.mock('@/pages/MatjaronaHome', () => ({
  default: () => <div>Landing Matjarona</div>,
}));

vi.mock('@/components/layout/PageLoader', () => ({
  default: () => <div>Chargement…</div>,
}));

import { useTenant } from '@/contexts/TenantContext';

describe('HomeRoute', () => {
  it('affiche le loader pendant le chargement', () => {
    vi.mocked(useTenant).mockReturnValue({
      store: null,
      slug: null,
      isLoading: true,
      isPlatformHost: true,
      storeUnavailableMessage: null,
      refresh: vi.fn(),
      loadFromAdminSession: vi.fn(),
    });
    renderWithProviders(<HomeRoute />);
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });

  it('affiche la landing sans tenant', () => {
    vi.mocked(useTenant).mockReturnValue({
      store: null,
      slug: null,
      isLoading: false,
      isPlatformHost: true,
      storeUnavailableMessage: null,
      refresh: vi.fn(),
      loadFromAdminSession: vi.fn(),
    });
    renderWithProviders(<HomeRoute />);
    expect(screen.getByText('Landing Matjarona')).toBeInTheDocument();
  });

  it('affiche la boutique si store + slug résolus', () => {
    vi.mocked(useTenant).mockReturnValue({
      store: { siteName: 'Atlas', slug: 'atlas' } as never,
      slug: 'atlas',
      isLoading: false,
      isPlatformHost: false,
      storeUnavailableMessage: null,
      refresh: vi.fn(),
      loadFromAdminSession: vi.fn(),
    });
    renderWithProviders(<HomeRoute />);
    expect(screen.getByText('Storefront Index')).toBeInTheDocument();
  });
});
