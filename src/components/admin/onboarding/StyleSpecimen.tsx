import type { CSSProperties } from 'react';
import { FONT_PAIRS } from '@/config/storefrontTheme';
import type { StylePreset } from '@/config/stylePresets';

const RADIUS_PX: Record<string, number> = { sharp: 0, subtle: 4, soft: 8, round: 12, pill: 14 };

const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, white)`;

type Props = {
  preset: StylePreset;
  /** Nom du style, écrit dans la vraie police du style. */
  label: string;
  /** Remplace les couleurs du style (variantes de palette d'un modèle). */
  primary?: string;
  secondary?: string;
  /** Mise en page de la miniature (clé de style) ; par défaut celle du style. */
  layout?: string;
  /** Réglages visuels (polices, arrondis) propres à une variante. */
  tweak?: Partial<Pick<StylePreset, 'fontPair' | 'radiusPreset'>>;
};

/**
 * Miniature de vitrine : chaque style a sa propre mise en page, ses couleurs, sa police et ses arrondis,
 * pour que le marchand compare de vraies boutiques et pas des pastilles de couleur.
 */
export function StyleSpecimen({ preset: basePreset, label, primary, secondary, layout, tweak }: Props) {
  const preset = { ...basePreset, ...tweak, key: layout ?? basePreset.key };
  const { radiusPreset } = preset;
  const p = primary ?? preset.primaryColor;
  const s = secondary ?? preset.secondaryColor;
  const display = FONT_PAIRS.find((f) => f.key === preset.fontPair)?.display;
  const r = RADIUS_PX[radiusPreset] ?? 8;
  const tile = (bg: string, extra?: CSSProperties): CSSProperties => ({ background: bg, borderRadius: r, ...extra });
  const title: CSSProperties = { fontFamily: display, lineHeight: 1.05 };

  return (
    <div
      aria-hidden
      className="relative aspect-[5/4] w-full overflow-hidden rounded-lg border border-black/10 bg-white text-[#1c1917] dark:border-white/15"
    >
      {preset.key === 'magazine' ? (
        <div className="flex h-full flex-col gap-2 p-3">
          <div className="flex items-center justify-between"><span className="h-1 w-8 bg-current" /><span className="h-1 w-12 bg-black/20" /></div>
          <div className="grid min-h-0 flex-1 grid-cols-[1.1fr_1fr] gap-2">
            <div className="flex flex-col justify-between">
              <p className="text-[24px] font-semibold" style={title}>{label}</p>
              <span className="flex flex-col gap-1"><span className="h-1 w-full bg-black/20" /><span className="h-1 w-3/4 bg-black/20" /><span className="mt-1 h-2.5 w-14" style={{ background: '#1c1917', borderRadius: r }} /></span>
            </div>
            <span style={tile(tint(p, 20), { marginBlockStart: 12 })} />
          </div>
          <div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-6" style={tile(tint(i === 1 ? s : p, 14))} />)}</div>
        </div>
      ) : null}

      {preset.key === 'lookbook' ? (
        <div className="flex h-full flex-col">
          <div className="relative flex-1" style={{ background: `linear-gradient(160deg, ${tint(p, 35)}, ${tint(s, 55)})` }}>
            <div className="absolute inset-x-3 bottom-3">
              <p className="text-[18px] font-semibold text-white drop-shadow" style={title}>{label}</p>
              <span className="mt-1.5 block h-3 w-14 border border-white" style={{ borderRadius: r }} />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-px bg-white pt-px">{[0, 1, 2, 3, 4].map((i) => <span key={i} className="h-7" style={{ background: tint(i % 2 ? s : p, 18 + i * 3) }} />)}</div>
        </div>
      ) : null}

      {preset.key === 'split' ? (
        <div className="flex h-full flex-col">
          <div className="grid flex-1 grid-cols-2">
            <div className="flex flex-col justify-center gap-1.5 p-3" style={{ background: p, color: '#fff' }}>
              <p className="text-[16px] font-semibold" style={title}>{label}</p>
              <span className="h-2.5 w-12 bg-white" style={{ borderRadius: r }} />
            </div>
            <span style={{ background: tint(s, 40) }} />
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-2">{[0, 1, 2].map((i) => <span key={i} className="h-8 border border-black/15" style={{ borderRadius: r, background: tint(p, 8) }} />)}</div>
        </div>
      ) : null}

      {preset.key === 'bento' ? (
        <div className="flex h-full flex-col gap-1.5 p-2.5">
          <p className="text-[13px] font-bold" style={title}>{label}</p>
          <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-1.5">
            <span className="col-span-2 row-span-2" style={tile(p)} />
            <span style={tile(tint(s, 45))} />
            <span style={tile(tint(p, 25))} />
          </div>
        </div>
      ) : null}

      {preset.key === 'catalogue' ? (
        <div className="flex h-full flex-col gap-1.5 p-2">
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: p }} /><span className="h-2.5 flex-1 border border-black/20" style={{ borderRadius: r }} /></div>
          <div className="flex h-8 items-center px-2 text-[11px] font-bold text-white" style={{ background: p, borderRadius: r, ...title }}>{label}</div>
          <div className="grid flex-1 grid-cols-4 gap-1">
            {Array.from({ length: 8 }, (_, i) => <span key={i} className="border border-black/15" style={{ borderRadius: r, background: tint(i % 3 === 0 ? s : p, 10) }} />)}
          </div>
        </div>
      ) : null}

      {preset.key === 'glass' ? (
        <div className="relative flex h-full flex-col items-center justify-center gap-2 p-3" style={{ background: `linear-gradient(135deg, ${p}, ${s})` }}>
          <div className="w-4/5 border border-white/50 bg-white/25 p-2.5 text-center text-white backdrop-blur" style={{ borderRadius: r + 4 }}>
            <p className="text-[15px] font-semibold" style={title}>{label}</p>
            <span className="mx-auto mt-1.5 block h-2.5 w-12 bg-white/90" style={{ borderRadius: 999 }} />
          </div>
          <div className="flex w-4/5 gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-5 flex-1 border border-white/40 bg-white/20" style={{ borderRadius: r + 2 }} />)}</div>
        </div>
      ) : null}

      {preset.key === 'monochrome' ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-2.5 py-2">
            <span className="flex gap-1"><span className="h-0.5 w-3 bg-current" /><span className="h-0.5 w-3 bg-current" /></span>
            <p className="text-[8px] font-semibold uppercase tracking-[0.35em]" style={{ fontFamily: display }}>{label}</p>
            <span className="h-0.5 w-4 bg-current" />
          </div>
          <div className="relative flex-1" style={{ background: tint(p, 14) }}>
            <span className="absolute bottom-2 start-2.5 h-px w-8 bg-current" />
            <span className="absolute bottom-3.5 start-2.5 h-0.5 w-14 bg-current" />
          </div>
          <div className="grid grid-cols-4 gap-px bg-white pt-px">
            {[18, 26, 14, 22].map((a, i) => (
              <span key={i} className="h-8" style={{ background: tint(i % 2 ? s : p, a) }} />
            ))}
          </div>
        </div>
      ) : null}

      {preset.key === 'editorial' ? (
        <div className="flex h-full flex-col gap-2 p-3">
          <div className="flex items-center justify-between">
            <span className="h-1 w-6 bg-current" />
            <span className="h-1 w-10 bg-black/20" />
          </div>
          <p className="mt-1 text-[19px] font-semibold" style={title}>{label}</p>
          <span className="h-px w-full bg-black/25" />
          <div className="grid min-h-0 flex-1 grid-cols-[1.4fr_1fr] gap-2">
            <span style={tile(tint(p, 14))} />
            <span style={tile(tint(s, 35), { marginBlockStart: 14 })} />
          </div>
        </div>
      ) : null}

      {preset.key === 'flash' ? (
        <div className="flex h-full flex-col">
          <div className="relative flex flex-1 flex-col justify-end p-3" style={{ background: p, color: '#fff' }}>
            <p className="text-[20px] font-bold uppercase" style={title}>{label}</p>
            <span className="mt-1.5 h-3 w-14" style={{ background: '#fff', borderRadius: r }} />
            <span
              className="absolute end-2 top-2 px-1.5 py-0.5 text-[10px] font-bold text-white"
              style={{ background: s, borderRadius: r, transform: 'rotate(-6deg)' }}
            >
              -30%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-7" style={tile(tint(i === 1 ? s : p, 22))} />
            ))}
          </div>
        </div>
      ) : null}

      {preset.key === 'marche' ? (
        <div className="grid h-full grid-cols-[28%_1fr] gap-2 p-2">
          <div className="flex flex-col gap-1.5 pt-1">
            <p className="text-[13px] font-bold" style={title}>{label}</p>
            {[70, 90, 55, 80, 60].map((w, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 shrink-0" style={{ background: i < 2 ? p : 'rgba(0,0,0,.2)', borderRadius: 1 }} />
                <span className="h-1 bg-black/20" style={{ width: `${w}%` }} />
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} style={tile(tint(i % 4 === 0 ? s : p, 16 + (i % 3) * 6))} />
            ))}
          </div>
        </div>
      ) : null}

      {preset.key === 'nordique' ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center">
          <p className="text-[15px] font-semibold" style={title}>{label}</p>
          <span className="h-1 w-8" style={{ background: s }} />
          <span className="h-[46%] w-[38%]" style={tile(tint(p, 12))} />
        </div>
      ) : null}

      {preset.key === 'artisan' ? (
        <div className="flex h-full flex-col gap-2 p-3" style={{ background: tint(s, 22) }}>
          <p className="text-[19px] font-semibold" style={{ ...title, color: p }}>{label}</p>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
            <span style={tile(tint(p, 28), { borderRadius: `${r * 4}px ${r * 4}px ${r}px ${r}px` })} />
            <span style={tile(tint(p, 16), { borderRadius: `${r * 4}px ${r * 4}px ${r}px ${r}px`, marginBlockStart: 10 })} />
          </div>
          <span className="h-2.5 w-16" style={{ background: p, borderRadius: r }} />
        </div>
      ) : null}

      {preset.key === 'classique' ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-1.5 border-b border-black/10 px-2 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p }} />
            <span className="h-1 w-5 bg-black/20" />
            <span className="h-1 w-5 bg-black/20" />
          </div>
          <div className="m-2 flex flex-col justify-center gap-1.5 px-2.5 py-3" style={{ background: p, borderRadius: r, color: '#fff' }}>
            <p className="text-[15px] font-semibold" style={title}>{label}</p>
            <span className="h-2.5 w-12 bg-white" style={{ borderRadius: r }} />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-1.5 px-2 pb-2">
            {[0, 1, 2].map((i) => (
              <span key={i} style={tile(tint(i === 1 ? s : p, 16))} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
