import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminFirstUseGuide, { GUIDE_STEP_DEFS } from './AdminFirstUseGuide';
import { adminMessages } from '@/i18n/admin/adminMessages';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';

const setUser = vi.fn();
const updateAdminGuide = vi.fn();

vi.mock('@/contexts/AdminContext', () => ({
  useAdmin: () => ({
    user: {
      id: 2,
      email: 'admin@test.local',
      role: 'ADMIN',
      adminGuideCompleted: false,
    },
    isSuperAdmin: false,
    setUser,
  }),
}));

const setLocale = vi.fn();

vi.mock('@/contexts/AdminLocaleContext', () => ({
  useAdminLocale: () => ({
    locale: 'fr',
    dir: 'ltr',
    setLocale,
    t: (key: AdminMessageKey, vars?: Record<string, string | number>) => {
      let raw = adminMessages.fr[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          raw = raw.replace(`{${k}}`, String(v));
        }
      }
      return raw;
    },
  }),
}));

vi.mock('@/services/api/auth', () => ({
  updateAdminGuide: (...args: unknown[]) => updateAdminGuide(...args),
}));

vi.mock('@/utils/toastMessages', () => ({
  toastError: vi.fn(),
}));

describe('AdminFirstUseGuide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateAdminGuide.mockResolvedValue({
      id: 2,
      email: 'admin@test.local',
      role: 'ADMIN',
      adminGuideCompleted: true,
    });
  });

  it('expose un parcours détaillé (plusieurs étapes)', () => {
    expect(GUIDE_STEP_DEFS.length).toBeGreaterThanOrEqual(8);
    expect(GUIDE_STEP_DEFS.map((s) => s.id)).toEqual(
      expect.arrayContaining(['welcome', 'catalog', 'orders', 'stock', 'ready']),
    );
  });

  it('s’ouvre automatiquement si le guide n’est pas terminé (FR)', () => {
    render(
      <MemoryRouter>
        <AdminFirstUseGuide />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Bienvenue dans votre back-office/i)).toBeInTheDocument();
    expect(screen.getByText(/Guide · 1\//i)).toBeInTheDocument();
  });

  it('passe à l’étape suivante puis termine en persist ant completed=true', async () => {
    render(
      <MemoryRouter>
        <AdminFirstUseGuide />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /suivant/i }));
    expect(screen.getByText(/Assistant de démarrage/i)).toBeInTheDocument();

    for (let i = 1; i < GUIDE_STEP_DEFS.length - 1; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));
    }
    expect(screen.getByText(/Vous êtes prêt/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /terminer/i }));
    await waitFor(() => {
      expect(updateAdminGuide).toHaveBeenCalledWith({ completed: true });
    });
    expect(setUser).toHaveBeenCalled();
  });

  it('Passer enregistre aussi completed=true', async () => {
    render(
      <MemoryRouter>
        <AdminFirstUseGuide />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /^passer$/i }));
    await waitFor(() => {
      expect(updateAdminGuide).toHaveBeenCalledWith({ completed: true });
    });
  });
});

describe('guideAdminExtra i18n', () => {
  it('traduit le titre welcome en ar et en', () => {
    expect(adminMessages.ar['guide.welcome.title']).toMatch(/مرحب/);
    expect(adminMessages.en['guide.welcome.title']).toMatch(/Welcome/i);
    expect(adminMessages.fr['guide.menu']).toMatch(/Guide/i);
    expect(adminMessages.en['guide.menu']).toMatch(/User guide/i);
    expect(adminMessages.ar['guide.menu']).toMatch(/دليل/);
  });
});
