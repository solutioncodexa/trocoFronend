import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isPlatformHostname,
  resolveTenantSlug,
  resolveTenantSlugFromHost,
} from './TenantContext';

describe('tenant resolution helpers', () => {
  const original = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
    vi.unstubAllEnvs();
  });

  it('détecte les hosts plateforme', () => {
    expect(isPlatformHostname('localhost')).toBe(true);
    expect(isPlatformHostname('127.0.0.1')).toBe(true);
    expect(isPlatformHostname('matjarona.ma')).toBe(true);
    expect(isPlatformHostname('www.matjarona.ma')).toBe(true);
    expect(isPlatformHostname('shop.localhost')).toBe(false);
  });

  it('extrait le slug depuis *.localhost', () => {
    expect(resolveTenantSlugFromHost('maison.localhost')).toBe('maison');
    expect(resolveTenantSlugFromHost('www.localhost')).toBeNull();
  });

  it('extrait le slug depuis *.matjarona.*', () => {
    expect(resolveTenantSlugFromHost('atlas.matjarona.ma')).toBe('atlas');
    expect(resolveTenantSlugFromHost('www.matjarona.ma')).toBeNull();
  });

  it('priorise ?tenant= sur le host', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...original,
        hostname: 'atlas.localhost',
        search: '?tenant=override',
      },
    });
    expect(resolveTenantSlug()).toBe('override');
  });
});
