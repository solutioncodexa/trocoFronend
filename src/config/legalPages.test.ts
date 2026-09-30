import { describe, expect, it } from 'vitest';
import {
  LEGAL_FOOTER_LINKS,
  MENTIONS_PAGE_SLUG,
  PRIVACY_PAGE_SLUG,
  TERMS_PAGE_SLUG,
  resolvePrivacyPolicyLink,
} from './legalPages';

describe('resolvePrivacyPolicyLink', () => {
  it('utilise le slug CMS par défaut', () => {
    expect(resolvePrivacyPolicyLink(undefined)).toEqual({
      path: `/page/${PRIVACY_PAGE_SLUG}`,
      external: false,
    });
    expect(resolvePrivacyPolicyLink('  ')).toEqual({
      path: `/page/${PRIVACY_PAGE_SLUG}`,
      external: false,
    });
  });

  it('conserve un chemin interne', () => {
    expect(resolvePrivacyPolicyLink('/page/confidentialite')).toEqual({
      path: '/page/confidentialite',
      external: false,
    });
  });

  it('marque une URL http(s) comme externe', () => {
    expect(resolvePrivacyPolicyLink('https://example.com/privacy')).toEqual({
      path: 'https://example.com/privacy',
      external: true,
    });
  });
});

describe('LEGAL_FOOTER_LINKS', () => {
  it('pointe vers mentions, confidentialité et CGV', () => {
    expect(LEGAL_FOOTER_LINKS.map((l) => l.slug)).toEqual([
      MENTIONS_PAGE_SLUG,
      PRIVACY_PAGE_SLUG,
      TERMS_PAGE_SLUG,
    ]);
  });
});
