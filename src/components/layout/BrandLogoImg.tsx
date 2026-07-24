import trocoLogo from '@/assets/troco-logo.png';
import { cn } from '@/lib/utils';

type BrandLogoImgProps = Omit<React.ComponentPropsWithoutRef<'img'>, 'src'> & {
  /** Hauteur du logo (largeur auto, ratio conservé) */
  className?: string;
};

export function BrandLogoImg({ className, alt = 'Troco', ...props }: BrandLogoImgProps) {
  return (
    <img
      src={trocoLogo}
      alt={alt}
      className={cn('h-auto w-auto max-w-full object-contain object-left', className)}
      {...props}
    />
  );
}
