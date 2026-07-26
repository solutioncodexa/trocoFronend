import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import CreateStore from './CreateStore';

const registerStore = vi.fn();
const login = vi.fn();

vi.mock('@/services/api/platform', () => ({
  platformApi: {
    registerStore: (...args: unknown[]) => registerStore(...args),
  },
}));

vi.mock('@/contexts/AdminContext', () => ({
  useAdmin: () => ({
    login: (...args: unknown[]) => login(...args),
  }),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe('CreateStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    registerStore.mockResolvedValue({
      id: 1,
      name: 'Maison Atlas',
      slug: 'maison-atlas',
      status: 'ACTIVE',
    });
    login.mockResolvedValue({ ok: true });
  });

  it('génère le slug depuis le nom et soumet l’inscription', async () => {
    renderWithProviders(<CreateStore />, { initialEntries: ['/creer-boutique'] });

    expect(screen.getByRole('heading', { name: /Créer ma boutique/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Nom de la boutique/i), {
      target: { value: 'Maison Atlas' },
    });
    expect(screen.getByLabelText(/Adresse \(slug\)/i)).toHaveValue('maison-atlas');

    fireEvent.change(screen.getByLabelText(/Email admin/i), {
      target: { value: 'admin@maison-atlas.test' },
    });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Lancer ma boutique/i }));

    await waitFor(() => {
      expect(registerStore).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Maison Atlas',
          slug: 'maison-atlas',
          adminEmail: 'admin@maison-atlas.test',
          planCode: 'basic',
        }),
      );
    });
    expect(login).toHaveBeenCalledWith('admin@maison-atlas.test', 'Password123!');
  });

  it('refuse un mot de passe trop court', async () => {
    const { toast } = await import('sonner');
    renderWithProviders(<CreateStore />);

    fireEvent.change(screen.getByLabelText(/Nom de la boutique/i), { target: { value: 'Shop' } });
    fireEvent.change(screen.getByLabelText(/Email admin/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /Lancer ma boutique/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    expect(registerStore).not.toHaveBeenCalled();
  });
});
