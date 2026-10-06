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

vi.mock('@/contexts/AdminLocaleContext', () => ({
  useAdminLocale: () => ({ locale: 'fr', setLocale: vi.fn(), dir: 'ltr' }),
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
    // L'adresse se déduit du nom ; le champ n'apparaît que si on choisit de la modifier.
    expect(screen.getByText(/maison-atlas/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Votre email/i), {
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

  it('propose une adresse de secours pour un nom arabe (INS-05)', async () => {
    renderWithProviders(<CreateStore />);

    fireEvent.change(screen.getByLabelText(/Nom de la boutique/i), {
      target: { value: 'متجر الأطلس' },
    });
    expect(screen.getByText(/boutique-[a-z0-9]{4}\b/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Votre email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Lancer ma boutique/i }));

    await waitFor(() => {
      expect(registerStore).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'متجر الأطلس',
          slug: expect.stringMatching(/^boutique-[a-z0-9]{4}$/),
        }),
      );
    });
  });

  it('refuse un mot de passe trop court', async () => {
    const { toast } = await import('sonner');
    renderWithProviders(<CreateStore />);

    fireEvent.change(screen.getByLabelText(/Nom de la boutique/i), { target: { value: 'Shop' } });
    fireEvent.change(screen.getByLabelText(/Votre email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /Lancer ma boutique/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    expect(registerStore).not.toHaveBeenCalled();
  });
});
