import goldYaraLogo from '@/assets/GOLD_YARA_LOGO (1).png';
import { cn } from '@/lib/utils';

type BrandLogoImgProps = Omit<React.ComponentPropsWithoutRef<'img'>, 'src'> & {
  /** Hauteur du logo (largeur auto, ratio conservé) */
  className?: string;
};

export function BrandLogoImg({ className, alt = 'GOLD YaRa — YaraGold', ...props }: BrandLogoImgProps) {
  return (
    <img
      src={goldYaraLogo}
      alt={alt}
      className={cn('h-auto w-auto max-w-full object-contain object-left', className)}
      {...props}
    />
  );
}
