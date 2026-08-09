import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Store, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';
import { markStockAlertPending } from '@/utils/stockAlertSession';
import { setStoredTenantSlug } from '@/config/api';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import {
  ADMIN_LOCALES,
  ADMIN_LOCALE_LABELS,
  type AdminLocale,
} from '@/i18n/admin/adminMessages';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type LoginLocationState = {
  email?: string;
  createdSlug?: string;
  from?: { pathname?: string };
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state || {}) as LoginLocationState;
  const { login, isAuthenticated, isSuperAdmin, isLoading: authLoading } = useAdmin();
  const { siteName, hasStore } = useStoreBrand();
  const { t, locale, setLocale, dir } = useAdminLocale();
  const [email, setEmail] = useState(locationState.email ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locationState.createdSlug) {
      setStoredTenantSlug(locationState.createdSlug);
    }
    if (locationState.email) {
      setEmail(locationState.email);
    }
    if (locationState.from?.pathname) {
      setError(t('login.errorAccess'));
    }
  }, [locationState.createdSlug, locationState.email, locationState.from?.pathname, t]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (isSuperAdmin) {
      navigate('/super-admin/dashboard', { replace: true });
    } else {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, isSuperAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email.trim(), password);
    if (result.ok === false) {
      setError(result.error || t('login.errorCredentials'));
      setIsLoading(false);
      return;
    }
    if (result.role === 'SUPER_ADMIN') {
      navigate('/super-admin/dashboard');
    } else {
      markStockAlertPending();
      navigate('/admin/dashboard');
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(220_22%_12%)] text-white/70" dir={dir} lang={locale}>
        {t('common.loading')}
      </div>
    );
  }

  const bullets = [t('login.bullet1'), t('login.bullet2'), t('login.bullet3')];

  return (
    <div className="grid min-h-screen lg:grid-cols-2" dir={dir} lang={locale}>
      <div className="relative hidden overflow-hidden bg-[hsl(220_22%_12%)] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 70% 50% at 20% 20%, hsl(var(--primary) / 0.35) 0%, transparent 55%),
              radial-gradient(ellipse 60% 40% at 80% 70%, hsl(203 55% 45% / 0.25) 0%, transparent 50%)
            `,
          }}
          aria-hidden
        />
        <div className="relative z-10">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            {t('login.sellerSpace')}
          </p>
          <h1 className="mt-4 max-w-md font-display text-4xl font-bold leading-tight tracking-tight text-white">
            {t('login.title')}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            {t('login.subtitle')}
          </p>
        </div>
        <ul className="relative z-10 space-y-3 text-sm text-white/70">
          {bullets.map((line) => (
            <li key={line} className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/30 text-primary-foreground">
                <Store className="h-3.5 w-3.5" />
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center bg-[hsl(220_20%_97%)] p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-4 flex justify-end">
            <Select value={locale} onValueChange={(v) => setLocale(v as AdminLocale)}>
              <SelectTrigger className="h-9 w-[9.5rem] text-xs" aria-label={t('common.language')}>
                <Globe className="me-2 h-3.5 w-3.5 shrink-0 opacity-70" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_LOCALES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {ADMIN_LOCALE_LABELS[code]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-8 text-center lg:text-start">
            <BrandLogoImg
              className="mx-auto mb-4 h-14 w-auto max-w-[220px] lg:mx-0"
              draggable={false}
            />
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {t('login.signIn')}
              {hasStore && siteName ? ` — ${siteName}` : ''}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t('login.accessDashboard')}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-soft sm:p-8">
            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">{t('login.email')}</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 ps-10"
                    placeholder="vous@boutique.ma"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">{t('login.password')}</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 ps-10 pe-10"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={isLoading}>
                {isLoading ? t('login.submitting') : t('login.submit')}
              </Button>
            </form>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
            <Link to="/" className="hover:text-primary">
              {t('login.backToSite')}
            </Link>
            <Link to="/creer-boutique" className="hover:text-primary">
              {t('login.createStore')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
