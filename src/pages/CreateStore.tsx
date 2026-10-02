import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Store, XCircle } from 'lucide-react';
import { platformApi } from '@/services/api/platform';
import { setStoredTenantSlug } from '@/config/api';
import { useAdmin } from '@/contexts/AdminContext';
import { markStockAlertPending } from '@/utils/stockAlertSession';
import { buildStorefrontUrl } from '@/utils/storefrontUrl';
import { writeOnboardingDraft } from '@/utils/onboardingSession';
import { STARTER_PACKS, getStarterPack } from '@/config/starterPacks';
import { TRIAL_DAYS } from '@/config/site';
import { toast } from 'sonner';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/** Nettoyage pendant la saisie : on autorise le « - » final (on est en train de taper). */
function cleanSlugInput(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 60);
}

/** Mêmes règles que le backend : 3 à 60 caractères, lettres minuscules, chiffres et tirets. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type FieldErrors = Partial<Record<'name' | 'slug' | 'adminEmail' | 'adminPassword', string>>;

type SlugState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'ok' }
  | { status: 'unavailable'; reason?: string; suggestion?: string };

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-300">
      {children}
    </p>
  );
}

const inputClass =
  'w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none ring-teal-500/40 focus:ring-2';

const CreateStore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAdmin();
  const [pending, setPending] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [slugState, setSlugState] = useState<SlugState>({ status: 'idle' });
  const [sector, setSector] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  // Nom sans lettre latine (ex. arabe) → slug vide : on propose une adresse de secours modifiable.
  const fallbackSlug = useRef(`boutique-${Math.random().toString(36).slice(2, 6)}`);
  const formRef = useRef<HTMLFormElement>(null);
  const initialPlan = searchParams.get('plan')?.trim() || 'basic';
  const [form, setForm] = useState({
    name: '',
    slug: '',
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
    phone: '',
    planCode: initialPlan,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['platform', 'plans'],
    queryFn: () => platformApi.getPlans(),
    staleTime: 10 * 60 * 1000,
  });
  const planName = plans.find((p) => p.code === form.planCode)?.name;

  const previewUrl = useMemo(
    () => (form.slug.trim() ? buildStorefrontUrl(form.slug.trim()) : null),
    [form.slug],
  );

  // Disponibilité de l'adresse en direct (anti-rebond). Une erreur réseau ne bloque jamais l'inscription.
  useEffect(() => {
    const slug = form.slug.trim().toLowerCase();
    if (slug.length < 3) {
      setSlugState({ status: 'idle' });
      return;
    }
    setSlugState({ status: 'checking' });
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const res = await platformApi.checkSlug(slug);
        if (cancelled) return;
        setSlugState(
          res.available
            ? { status: 'ok' }
            : { status: 'unavailable', reason: res.reason, suggestion: res.suggestion },
        );
      } catch {
        if (!cancelled) setSlugState({ status: 'idle' });
      }
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [form.slug]);

  const patch = (key: keyof typeof form, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !slugTouched) {
        next.slug = slugify(value) || (value.trim() ? fallbackSlug.current : '');
      }
      return next;
    });
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    const slug = form.slug.trim().toLowerCase();
    if (!form.name.trim()) next.name = 'Indiquez le nom de votre boutique.';
    if (!slug) next.slug = 'Choisissez une adresse pour votre boutique (lettres, chiffres, tirets).';
    else if (slug.length < 3) next.slug = 'L’adresse doit contenir au moins 3 caractères.';
    else if (!SLUG_RE.test(slug)) next.slug = 'Utilisez uniquement des lettres, chiffres et tirets (sans tiret au début ou à la fin).';
    else if (slugState.status === 'unavailable') next.slug = 'Cette adresse n’est pas disponible — choisissez-en une autre.';
    if (!form.adminEmail.trim() || !/^\S+@\S+\.\S+$/.test(form.adminEmail.trim())) {
      next.adminEmail = 'Saisissez une adresse email valide.';
    }
    if (form.adminPassword.length < 8) next.adminPassword = 'Le mot de passe doit contenir au moins 8 caractères.';
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const firstInvalid = (['name', 'slug', 'adminEmail', 'adminPassword'] as const).find((k) => found[k]);
    if (firstInvalid) {
      toast.error('Corrigez les champs indiqués en rouge');
      const el = formRef.current?.querySelector<HTMLElement>(`#${firstInvalid}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
      return;
    }
    setPending(true);
    try {
      const created = await platformApi.registerStore({
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        adminEmail: form.adminEmail.trim(),
        adminPassword: form.adminPassword,
        adminFullName: form.adminFullName.trim() || undefined,
        phone: form.phone.trim() || undefined,
        planCode: form.planCode || 'basic',
      });
      setStoredTenantSlug(created.slug);
      // Le secteur choisi ici préremplit l'assistant (thème conseillé + produits d'exemple).
      if (sector) {
        writeOnboardingDraft({
          step: 0,
          sector,
          themeKey: getStarterPack(sector).suggestedTheme,
          siteName: created.name,
        });
      }
      const auth = await login(form.adminEmail.trim(), form.adminPassword);
      if (auth.ok) {
        markStockAlertPending();
        const pendingActivation = (created.status || '').toUpperCase() === 'PENDING';
        toast.success(
          pendingActivation
            ? `Boutique « ${created.name} » créée — en attente d'activation Get STORE`
            : `Boutique « ${created.name} » créée — essai gratuit de ${TRIAL_DAYS} jours démarré`,
        );
        navigate('/admin/onboarding', {
          replace: true,
          state: { onboarding: true, pendingActivation },
        });
      } else {
        toast.success(`Boutique créée. Connectez-vous avec ${form.adminEmail.trim()}`);
        navigate('/admin', {
          replace: true,
          state: { email: form.adminEmail.trim(), createdSlug: created.slug },
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Impossible de créer la boutique');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(165deg,#071018_0%,#0a1628_42%,#0c1f2e_100%)] text-[#e8f4f2]">
      <div className="mx-auto max-w-lg px-5 py-10 sm:px-8">
        <Link
          to="/matjarona"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#e8f4f2]/70 hover:text-[#e8f4f2]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour Get STORE
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight sm:text-3xl">
              Créer ma boutique
            </h1>
            <p className="text-sm text-[#e8f4f2]/65">
              Essai gratuit de {TRIAL_DAYS} jours, sans carte bancaire — en ligne en 3 minutes
            </p>
          </div>
        </div>

        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6"
        >
          <fieldset className="space-y-4">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-teal-300">
              1 · Votre boutique
            </legend>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="name">
                Nom de la boutique
              </label>
              <input
                id="name"
                required
                className={inputClass}
                value={form.name}
                onChange={(e) => {
                  patch('name', e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Ex. Maison Atlas"
                autoFocus
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name ? <FieldError id="name-error">{errors.name}</FieldError> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="slug">
                Adresse (slug)
              </label>
              <div className="relative">
                <input
                  id="slug"
                  required
                  className={`${inputClass} pr-10 font-mono`}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    patch('slug', cleanSlugInput(e.target.value));
                    if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
                  }}
                  onBlur={() => patch('slug', form.slug.replace(/^-+|-+$/g, ''))}
                  placeholder="maison-atlas"
                  aria-invalid={!!errors.slug}
                  aria-describedby={errors.slug ? 'slug-error' : 'slug-hint'}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden>
                  {slugState.status === 'checking' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#e8f4f2]/50" />
                  ) : slugState.status === 'ok' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : slugState.status === 'unavailable' ? (
                    <XCircle className="h-4 w-4 text-red-400" />
                  ) : null}
                </span>
              </div>
              {errors.slug ? <FieldError id="slug-error">{errors.slug}</FieldError> : null}
              <p id="slug-hint" className="mt-1.5 break-all text-xs text-[#e8f4f2]/50" aria-live="polite">
                {slugState.status === 'unavailable' ? (
                  <span className="text-red-300">
                    {slugState.reason === 'invalid'
                      ? 'Adresse invalide (3 caractères minimum : lettres, chiffres, tirets).'
                      : 'Cette adresse est déjà prise.'}{' '}
                    {slugState.suggestion ? (
                      <button
                        type="button"
                        className="underline hover:text-red-200"
                        onClick={() => {
                          setSlugTouched(true);
                          patch('slug', slugState.suggestion!);
                        }}
                      >
                        Utiliser « {slugState.suggestion} »
                      </button>
                    ) : null}
                  </span>
                ) : previewUrl ? (
                  <>
                    Votre boutique : <span className="text-[#e8f4f2]/80">{previewUrl}</span>
                  </>
                ) : (
                  'Choisissez un slug pour voir l’URL de votre boutique'
                )}
              </p>
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium">Que vendez-vous ? (optionnel)</span>
              <div className="grid grid-cols-2 gap-2">
                {STARTER_PACKS.map((pack) => (
                  <button
                    key={pack.key}
                    type="button"
                    aria-pressed={sector === pack.key}
                    onClick={() => setSector(sector === pack.key ? '' : pack.key)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                      sector === pack.key
                        ? 'border-teal-400 bg-teal-500/15 text-[#e8f4f2]'
                        : 'border-white/15 bg-black/10 text-[#e8f4f2]/75 hover:border-white/30'
                    }`}
                  >
                    <span className="block font-semibold">{pack.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-[#e8f4f2]/45">
                Nous préparons le design, les catégories et des produits d’exemple adaptés.
              </p>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-teal-300">
              2 · Votre compte
            </legend>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="adminFullName">
                Votre nom
              </label>
              <input
                id="adminFullName"
                className={inputClass}
                value={form.adminFullName}
                onChange={(e) => patch('adminFullName', e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="adminEmail">
                Email admin
              </label>
              <input
                id="adminEmail"
                type="email"
                required
                className={inputClass}
                value={form.adminEmail}
                onChange={(e) => {
                  patch('adminEmail', e.target.value);
                  if (errors.adminEmail) setErrors((prev) => ({ ...prev, adminEmail: undefined }));
                }}
                autoComplete="email"
                aria-invalid={!!errors.adminEmail}
                aria-describedby={errors.adminEmail ? 'adminEmail-error' : undefined}
              />
              {errors.adminEmail ? <FieldError id="adminEmail-error">{errors.adminEmail}</FieldError> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="adminPassword">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`${inputClass} pr-12`}
                  value={form.adminPassword}
                  onChange={(e) => {
                    patch('adminPassword', e.target.value);
                    if (errors.adminPassword) setErrors((prev) => ({ ...prev, adminPassword: undefined }));
                  }}
                  autoComplete="new-password"
                  aria-invalid={!!errors.adminPassword}
                  aria-describedby={errors.adminPassword ? 'adminPassword-error' : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e8f4f2]/55 hover:text-[#e8f4f2]"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.adminPassword ? (
                <FieldError id="adminPassword-error">{errors.adminPassword}</FieldError>
              ) : (
                <p className="mt-1.5 text-xs text-[#e8f4f2]/45">Minimum 8 caractères</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="phone">
                Téléphone / WhatsApp (optionnel)
              </label>
              <input
                id="phone"
                type="tel"
                className={inputClass}
                value={form.phone}
                onChange={(e) => patch('phone', e.target.value)}
                autoComplete="tel"
                placeholder="06 00 00 00 00"
              />
            </div>
          </fieldset>

          <div>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-[#e8a317] px-5 py-3.5 text-sm font-semibold text-[#0a1628] transition hover:brightness-110 disabled:opacity-60"
            >
              {pending ? 'Création…' : 'Lancer ma boutique'}
            </button>
            <p className="mt-3 text-center text-xs text-[#e8f4f2]/60">
              {TRIAL_DAYS} jours d’essai gratuit, puis{' '}
              {planName ? `plan ${planName}` : 'le plan choisi'} — vous pourrez changer de plan à tout moment.
            </p>
            <p className="mt-2 text-center text-xs text-[#e8f4f2]/50">
              Déjà un compte ?{' '}
              <Link to="/admin" className="underline hover:text-[#e8f4f2]">
                Connexion admin
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;
