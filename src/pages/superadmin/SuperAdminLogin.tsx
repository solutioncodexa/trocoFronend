import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isSuperAdmin, isLoading: authLoading } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && isSuperAdmin) {
      navigate('/super-admin/dashboard', { replace: true });
    } else if (isAuthenticated && !isSuperAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, isSuperAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email.trim(), password);
    if (result.ok) {
      if (result.role === 'SUPER_ADMIN') {
        navigate('/super-admin/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      setError(result.error || 'Email ou mot de passe incorrect');
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white/60">
        Chargement…
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a1628] p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-10 top-16 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-sky-600/10 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-[Syne,ui-sans-serif,sans-serif] text-3xl font-extrabold tracking-tight text-[#e8f4f2]">
            Matjarona
          </p>
          <p className="mt-2 text-sm uppercase tracking-widest text-white/50">Super Admin</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15">
              <Lock className="h-7 w-7 text-teal-300" />
            </div>
            <h2 className="text-2xl font-semibold text-[#e8f4f2]">Connexion plateforme</h2>
            <p className="mt-2 text-sm text-white/50">Gérez les boutiques Matjarona</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-red-200">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white/70">
                Email
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/15 bg-white/5 pl-10 text-white placeholder:text-white/30"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white/70">
                Mot de passe
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/15 bg-white/5 pl-10 pr-10 text-white placeholder:text-white/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 uppercase tracking-wider hover:bg-teal-700"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-white/45 transition-colors hover:text-white/80">
            ← Retour à Matjarona
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
