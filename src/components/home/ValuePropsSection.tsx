import { Package, Truck, ShieldCheck } from 'lucide-react';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { useLocale } from '@/contexts/LocaleContext';

const ValuePropsSection = () => {
  const { freeShippingThreshold } = useStoreBrand();
  const { t } = useLocale();
  const threshold = Number.isFinite(freeShippingThreshold) ? freeShippingThreshold : 750;

  const items = [
    {
      icon: Truck,
      title: t('fastDelivery'),
      text: t('fastDeliveryDesc', { n: threshold }),
    },
    {
      icon: ShieldCheck,
      title: t('securePayment'),
      text: t('securePaymentDesc'),
    },
    {
      icon: Package,
      title: t('qualityGuaranteed'),
      text: t('qualityGuaranteedDesc'),
    },
  ];

  return (
    <section className="border-y border-border/60 bg-muted/40 py-14 sm:py-16">
      <div className="container mx-auto px-4">
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {items.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="flex flex-col items-center gap-3 rounded-2xl px-4 py-2 text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="max-w-xs font-body text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ValuePropsSection;
