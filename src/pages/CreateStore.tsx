import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Eye, EyeOff, Store } from 'lucide-react';
import { platformApi } from '@/services/api/platform';
import { setStoredTenantSlug } from '@/config/api';
import { useAdmin } from '@/contexts/AdminContext';
import { markStockAlertPending } from '@/utils/stockAlertSession';
import { buildStorefrontUrl } from '@/utils/storefrontUrl';
import { toast } from 'sonner';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

const CreateStore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAdmin();
  const [pending, setPending] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const previewUrl = useMemo(
    () => (form.slug.trim() ? buildStorefrontUrl(form.slug.trim()) : null),
    [form.slug],
  );

  const patch = (key: keyof typeof form, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim() || !form.adminEmail.trim() || form.adminPassword.length < 8) {
      toast.error('Remplissez tous les champs (mot de passe min. 8 caractères)');
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
      const auth = await login(form.adminEmail.trim(), form.adminPassword);
      if (auth.ok) {
        markStockAlertPending();
        toast.success(
          `Boutique « ${created.name} » créée — en attente d'activation Get STORE`,
        );
        navigate('/admin/onboarding', {
          replace: true,
          state: { onboarding: true, pendingActivation: true },
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
              Activation par Get STORE après inscription
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="planCode">
              Plan
            </label>
            <select
              id="planCode"
              className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none ring-teal-500/40 focus:ring-2"
              value={form.planCode}
              onChange={(e) => patch('planCode', e.target.value)}
            >
              {(plans.length > 0
                ? plans
                : [
                    { code: 'basic', name: 'Basic', priceMad: 79 },
                    { code: 'pro', name: 'Pro', priceMad: 199 },
                    { code: 'business', name: 'Business', priceMad: 399 },
                  ]
              ).map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} — {Number(p.priceMad)} DHS / mois
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="name">
              Nom de la boutique
            </label>
            <input
              id="name"
              required
              className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none ring-teal-500/40 focus:ring-2"
              value={form.name}
              onChange={(e) => patch('name', e.target.value)}
              placeholder="Ex. Maison Atlas"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="slug">
              Adresse (slug)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="slug"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 font-mono text-sm outline-none ring-teal-500/40 focus:ring-2"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  patch('slug', e.target.value.toLowerCase());
                }}
                placeholder="maison-atlas"
              />
            </div>
            <p className="mt-1.5 break-all text-xs text-[#e8f4f2]/50">
              {previewUrl ? (
                <>
                  Aperçu :{' '}
                  <span className="text-[#e8f4f2]/80">{previewUrl}</span>
                </>
              ) : (
                'Choisissez un slug pour voir l’URL de votre boutique'
              )}
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="adminFullName">
              Votre nom
            </label>
            <input
              id="adminFullName"
              className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none ring-teal-500/40 focus:ring-2"
              value={form.adminFullName}
              onChange={(e) => patch('adminFullName', e.target.value)}
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
              className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none ring-teal-500/40 focus:ring-2"
              value={form.adminEmail}
              onChange={(e) => patch('adminEmail', e.target.value)}
            />
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
                minLength={8}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 pr-12 text-sm outline-none ring-teal-500/40 focus:ring-2"
                value={form.adminPassword}
                onChange={(e) => patch('adminPassword', e.target.value)}
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
            <p className="mt-1.5 text-xs text-[#e8f4f2]/45">Minimum 8 caractères</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="phone">
              Téléphone (optionnel)
            </label>
            <input
              id="phone"
              className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none ring-teal-500/40 focus:ring-2"
              value={form.phone}
              onChange={(e) => patch('phone', e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-xl bg-[#e8a317] px-5 py-3.5 text-sm font-semibold text-[#0a1628] transition hover:brightness-110 disabled:opacity-60"
          >
            {pending ? 'Création…' : 'Lancer ma boutique'}
          </button>
          <p className="text-center text-xs text-[#e8f4f2]/50">
            Déjà un compte ?{' '}
            <Link to="/admin" className="underline hover:text-[#e8f4f2]">
              Connexion admin
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;
