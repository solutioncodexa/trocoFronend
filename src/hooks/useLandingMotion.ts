import { useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Smooth scroll (Lenis) + animations au scroll (GSAP ScrollTrigger) pour la landing.
 * Limité à la page qui l'utilise ; tout est nettoyé au démontage.
 * Désactivé si `prefers-reduced-motion: reduce`.
 */
export function useLandingMotion(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  const lenisRef = useRef<Lenis | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
        lenisRef.current = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Hero : le ticket remonte légèrement plus lentement que la page.
        gsap.to('.gs-slip-wrap', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: '.gs-hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        // Titres de section.
        gsap.utils.toArray<HTMLElement>('.gs-h2, .gs-section-lede').forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 28,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          });
        });

        // Groupes qui apparaissent en cascade.
        ScrollTrigger.batch('.gs-ledger-row, .gs-step, .gs-plan', {
          start: 'top 88%',
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { autoAlpha: 0, y: 40 },
              { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, overwrite: true },
            ),
        });
        gsap.set('.gs-ledger-row, .gs-step, .gs-plan', { autoAlpha: 0 });

        // Tableau comparatif + bandeau final.
        gsap.from('.gs-table-wrap', {
          autoAlpha: 0,
          y: 32,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gs-table-wrap', start: 'top 88%', once: true },
        });
        gsap.from('.gs-closing > *', {
          autoAlpha: 0,
          y: 36,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gs-closing', start: 'top 75%', once: true },
        });

        // Les plans arrivent après le rendu des données API.
        const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);

        return () => {
          window.clearTimeout(refresh);
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = null;
        };
      });
    },
    { scope, dependencies: deps, revertOnUpdate: false },
  );

  return lenisRef;
}
