import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { buildStorefrontPath, buildStorefrontUrl, withStorefrontCacheBust } from './storefrontUrl';

describe('buildStorefrontPath', () => {
  it('retourne / sans slug', () => {
    expect(buildStorefrontPath(null)).toBe('/');
    expect(buildStorefrontPath('')).toBe('/');
  });

  it('ajoute ?tenant= pour un slug', () => {
    expect(buildStorefrontPath('maison-atlas')).toBe('/?tenant=maison-atlas');
  });
});

describe('withStorefrontCacheBust', () => {
  it('ajoute _v sur une URL propre', () => {
    expect(withStorefrontCacheBust('http://localhost:5173/?tenant=shop', 42)).toBe(
      'http://localhost:5173/?tenant=shop&_v=42',
    );
  });

  it('conserve les query existantes', () => {
    expect(withStorefrontCacheBust('http://192.168.1.10:5173/?tenant=demo', 99)).toBe(
      'http://192.168.1.10:5173/?tenant=demo&_v=99',
    );
  });
});

describe('buildStorefrontUrl', () => {
  const original = window.location;

  beforeEach(() => {
    // jsdom location is partially stubbable
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...original,
        origin: 'http://localhost:5173',
        protocol: 'http:',
        hostname: 'localhost',
        port: '5173',
        href: 'http://localhost:5173/',
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });

  it('utilise ?tenant= en local (fiable vs sous-domaine .localhost)', () => {
    expect(buildStorefrontUrl('atelier-nord')).toBe(
      'http://localhost:5173/?tenant=atelier-nord',
    );
  });

  it('utilise sous-domaine matjarona en prod', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        origin: 'https://matjarona.ma',
        protocol: 'https:',
        hostname: 'matjarona.ma',
        port: '',
      },
    });
    expect(buildStorefrontUrl('boutique-x')).toBe('https://boutique-x.matjarona.ma/');
  });

  it('fallback ?tenant= sur IP / host inconnu', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        origin: 'http://192.168.1.10:5173',
        protocol: 'http:',
        hostname: '192.168.1.10',
        port: '5173',
      },
    });
    expect(buildStorefrontUrl('demo')).toBe('http://192.168.1.10:5173/?tenant=demo');
  });
});
