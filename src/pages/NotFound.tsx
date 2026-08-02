import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useStoreAppearance } from "@/hooks/useStoreAppearance";
import { appearanceButtonClass, DEFAULT_APPEARANCE } from "@/config/storeAppearance";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

const NotFound = () => {
  const location = useLocation();
  const appearance = useStoreAppearance();
  const { t, locale } = useLocale();
  const ctaHref = appearance.notFoundCtaHref || "/";

  const title =
    locale === "fr" &&
    appearance.notFoundTitle &&
    appearance.notFoundTitle !== DEFAULT_APPEARANCE.notFoundTitle
      ? appearance.notFoundTitle
      : t("notFoundTitle");

  const message =
    locale === "fr" &&
    appearance.notFoundMessage &&
    appearance.notFoundMessage !== DEFAULT_APPEARANCE.notFoundMessage
      ? appearance.notFoundMessage
      : t("notFoundMessage");

  const ctaLabel =
    locale === "fr" &&
    appearance.notFoundCtaLabel &&
    appearance.notFoundCtaLabel !== DEFAULT_APPEARANCE.notFoundCtaLabel
      ? appearance.notFoundCtaLabel
      : t("backHome");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-display text-6xl md:text-8xl text-primary mb-4">404</h1>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            {title}
          </h2>
          <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
            {message}
          </p>
          <Button
            asChild
            size="lg"
            className={cn(
              appearanceButtonClass(appearance.buttonStyle, "font-body uppercase tracking-wider"),
            )}
          >
            <Link to={ctaHref}>
              <Home className="w-5 h-5 mr-2" />
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
