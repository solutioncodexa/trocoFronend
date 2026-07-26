import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';

const useAdmin = vi.fn();

vi.mock('@/contexts/AdminContext', () => ({
  useAdmin: () => useAdmin(),
}));

vi.mock('sonner', () => ({
  toast: { info: vi.fn(), success: vi.fn(), error: vi.fn() },
}));

function renderProtected(props: { permission?: string; adminOnly?: boolean; superAdminOnly?: boolean } = {}) {
  return render(
    <MemoryRouter initialEntries={['/admin/secret']}>
      <Routes>
        <Route path="/admin" element={<div>Login Admin</div>} />
        <Route path="/super-admin" element={<div>Login Super</div>} />
        <Route path="/admin/dashboard" element={<div>Dashboard</div>} />
        <Route
          path="/admin/secret"
          element={
            <ProtectedAdminRoute {...props}>
              <div>Secret Page</div>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedAdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirige vers /admin si non authentifié', () => {
    useAdmin.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
      isSuperAdmin: false,
      hasPermission: () => false,
    });
    renderProtected();
    expect(screen.getByText('Login Admin')).toBeInTheDocument();
  });

  it('affiche la page si admin authentifié', () => {
    useAdmin.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: true,
      isSuperAdmin: false,
      hasPermission: () => true,
    });
    renderProtected({ permission: 'PRODUCTS_VIEW' });
    expect(screen.getByText('Secret Page')).toBeInTheDocument();
  });

  it('redirige si permission manquante', () => {
    useAdmin.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
      isSuperAdmin: false,
      hasPermission: () => false,
    });
    renderProtected({ permission: 'MEMBERS_MANAGE' });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
