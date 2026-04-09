import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  /** Délai avant le début de l’animation (cascade) */
  delayMs?: number;
  /**
   * Si non défini : utilise `ANIMATIONS.sectionRevealOnScroll`
   * (pour la boutique, passer `ANIMATIONS.productGridStagger` explicitement)
   */
  enabled?: boolean;
};

/**
 * Fait apparaître le contenu une fois visible dans le viewport.
 */
export function RevealOnScroll({
  children,
  className,
  delayMs = 0,
  enabled = ANIMATIONS.sectionRevealOnScroll,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [enabled]);

  return (
    <div
      ref={ref}
      className={cn(
        enabled &&
          'transition-[opacity,transform] duration-700 ease-out [will-change:opacity,transform]',
        visible ? 'opacity-100 translate-y-0' : enabled && 'opacity-0 translate-y-8',
        className
      )}
      style={enabled ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
