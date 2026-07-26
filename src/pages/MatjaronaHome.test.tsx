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
        priceMad: 150,
        description: 'Plan Basic',
      },
    ]),
  },
}));

describe('MatjaronaHome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche la marque et le CTA créer boutique', async () => {
    renderWithProviders(<MatjaronaHome />);

    expect(screen.getAllByText('Matjarona').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Créer ma boutique/i }).length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText(/150/)).toBeInTheDocument();
    });
  });
});
