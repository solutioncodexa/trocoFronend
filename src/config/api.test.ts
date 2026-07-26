import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { API_BASE_URL, buildApiUrl, setStoredTenantSlug, TENANT_SLUG_STORAGE_KEY } from './api';

describe('api config', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('expose /api par défaut', () => {
    expect(API_BASE_URL).toBe('/api');
  });

  it('buildApiUrl normalise le slash', () => {
    expect(buildApiUrl('/products')).toBe('/api/products');
    expect(buildApiUrl('products')).toBe('/api/products');
  });

  it('persiste le slug tenant', () => {
    setStoredTenantSlug('maison-atlas');
    expect(localStorage.getItem(TENANT_SLUG_STORAGE_KEY)).toBe('maison-atlas');
    setStoredTenantSlug(null);
    expect(localStorage.getItem(TENANT_SLUG_STORAGE_KEY)).toBeNull();
  });
});
