/**
 * Aligné sur tailwind.config + index.css (:root).
 * Tablette inclut iPad Pro 12.9" portrait (1024×1366).
 */
export const BREAKPOINTS = {
  /** < 768px — classes Tailwind: default / max-md */
  mobileMax: 767,
  /** 768px — md: */
  tabletMin: 768,
  /** 1024px — zone tablette max (lg = 1025 → max-lg ≈ 1024px) */
  tabletMax: 1024,
  /** ≥ 1025px — lg: desktop */
  desktopMin: 1025,
  ipadProWidth: 1024,
  ipadProHeight: 1366,
  /** Référence mobile étroite (xs: dans Tailwind) */
  mobileRef: 390,
} as const;
